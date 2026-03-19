# Beyond Local Debugging: Distributed Diagnostics and Rank-Aware Analysis

Single-GPU memory debugging is already hard. You don't know which tensor grew, you don't know when it started, and your evidence disappears when the process exits.

Distributed training makes all of that worse. Now you have multiple ranks running simultaneously, each with its own memory state, and the failure mode you're hunting might only exist on one of them. The run fails on rank 2, but the logs from ranks 0, 1, and 3 are cluttered with unrelated output and don't tell you anything about what rank 2 was doing in the seconds before the crash. You're left making guesses about causality when what you actually need is a timeline that shows all four ranks simultaneously, aligned on the same clock, with anomalies flagged.

That's the problem distributed diagnostics in Stormlog is designed to solve. This post covers the full pipeline: how distributed identity is embedded into every telemetry event, how artifacts from multiple ranks can be analyzed together, and how the analyzer classifies what actually went wrong.

---

## Distributed Identity: Built Into Every Event

Before any analysis is possible, the telemetry has to know which rank it came from. Stormlog handles this through a distributed identity model that gets resolved at tracker initialization time and embedded into every event the tracker emits.

The four fields are `job_id`, `rank`, `local_rank`, and `world_size`. You can pass them explicitly:

```python
from stormlog import MemoryTracker

tracker = MemoryTracker(
    device="cuda",
    sampling_interval=0.5,
    enable_alerts=True,
    job_id="train-run-001",
    rank=2,
    local_rank=0,
    world_size=4,
)
```

Or you can let Stormlog infer them from the environment. If you're launching with `torchrun`, `torch.distributed.launch`, or a SLURM job scheduler, the relevant environment variables are already set, and Stormlog reads them automatically:

```python
# Stormlog reads: RANK, LOCAL_RANK, WORLD_SIZE, TORCHELASTIC_RUN_ID
# Also supports SLURM: SLURM_PROCID, SLURM_LOCALID, SLURM_NTASKS, SLURM_JOB_ID
# And Open MPI: OMPI_COMM_WORLD_RANK, OMPI_COMM_WORLD_LOCAL_RANK, OMPI_COMM_WORLD_SIZE

tracker = MemoryTracker(
    device="cuda",
    sampling_interval=0.5,
    enable_alerts=True,
    # No rank params needed when launching with torchrun or SLURM
)
```

The same inference logic applies to the CLI. If you're running `gpumemprof track` inside a distributed job, you can pass rank information explicitly or rely on environment inference:

```bash
# Explicit
gpumemprof track --duration 60 --rank 2 --local-rank 0 --world-size 4 --job-id run-001

# Or let the launcher environment handle it
torchrun --nproc_per_node=4 your_training_script.py
```

Once identity is resolved, every `TelemetryEventV2` record written by that tracker carries `job_id`, `rank`, `local_rank`, and `world_size` as structured fields — not buried in metadata, but as first-class schema fields. This means when you load artifacts from multiple ranks later, they can be merged and compared without any manual annotation.

---

## Per-Rank Instrumentation in Practice

In a multi-GPU training loop, the typical pattern is one `MemoryTracker` per process, each reporting its own rank. The training code barely changes:

```python
import torch
import torch.distributed as dist
from stormlog import MemoryTracker

# Initialize distributed (rank, world_size come from the process launcher)
dist.init_process_group(backend="nccl")
rank = dist.get_rank()
device = torch.device(f"cuda:{rank}")

# Tracker automatically infers rank from env when using torchrun
tracker = MemoryTracker(
    device=f"cuda:{rank}",
    sampling_interval=0.5,
    enable_alerts=True,
    enable_oom_flight_recorder=True,
    oom_dump_dir=f"artifacts/oom/rank_{rank}",
    job_id="distributed-run-001",
)
tracker.set_threshold("memory_warning_percent", 75.0)
tracker.set_threshold("memory_critical_percent", 90.0)
tracker.start_tracking()

try:
    with tracker.capture_oom(context=f"rank-{rank}-training"):
        for batch in dataloader:
            loss = model(batch)
            loss.backward()
            optimizer.step()
finally:
    tracker.stop_tracking()

# Each rank writes its own artifact bundle
tracker.export_events(f"artifacts/events_rank{rank}.json", format="json")
tracker.export_events(f"artifacts/events_rank{rank}.csv", format="csv")
```

Each rank produces an independent artifact bundle. The analysis step loads all of them together. No shared state, no coordination required at collection time.

---

## Cross-Rank Timeline Analysis

With artifacts from each rank saved, you can run cross-rank analysis without re-executing the training job. The CLI handles this directly:

```bash
# Load all rank artifacts and produce a cross-rank analysis report
gpumemprof analyze artifacts/events_rank0.json \
  --output cross_rank_analysis.json \
  --format json
```

When the input file contains events from multiple ranks — which it will if you concatenate the exports, or if you load them all into the analyzer from Python — the output includes a distributed analysis section:

```
Distributed Analysis:
Participating ranks: 0, 1, 2, 3
Missing ranks: none
Cluster onset (aligned ns): 1700000002000000000
Top first-cause suspect: rank 2 (high)
Evidence: timestamp_ns=1700000001900000000, lead_ns=100000000, delta=384MB
```

What this means: rank 2 showed a qualifying spike 100 milliseconds before the cluster onset — which is the timestamp of the second-earliest qualifying spike across all ranks. That 100ms lead is what makes rank 2 the high-confidence first-cause suspect.

From Python, you have more control:

```python
from stormlog import MemoryAnalyzer
from stormlog.telemetry import load_telemetry_events
from pathlib import Path

# Load and combine artifacts from all ranks
all_events = []
for rank in range(4):
    events = load_telemetry_events(f"artifacts/events_rank{rank}.json")
    all_events.extend(events)

analyzer = MemoryAnalyzer()
report = analyzer.generate_optimization_report(events=all_events)

# Cross-rank result
cross_rank = report["cross_rank_analysis"]
print(f"Participating ranks: {cross_rank['participating_ranks']}")
print(f"First-cause suspects: {cross_rank['first_cause_suspects']}")
```

The cross-rank merge aligns rank timelines by their first sample timestamp. If rank 1 started collecting 20ms after rank 0, the merger adjusts for that offset so the timelines can be compared on a shared clock. This matters: without alignment, a rank that started late would look like it spiked first simply because its timestamps start lower.

---

## What the First-Cause Analysis Actually Does

The first-cause algorithm is worth understanding because it tells you not just that rank 2 spiked, but what the evidence for that conclusion looks like.

For each rank, the analyzer scans the event stream for the first point where `device_used_bytes` crosses a threshold — specifically, a cumulative delta large enough to be statistically meaningful (at least 10% of the rank's observed peak, and at least 64 MB). That crossing point becomes the rank's "first spike timestamp."

Those timestamps are then compared across ranks. The cluster onset is defined as the second-earliest first-spike timestamp — the idea being that if one rank spiked earlier than everyone else, that's your likely cause; if two ranks spiked at the same aligned time, the onset was probably a collective operation that affected everyone simultaneously.

The confidence classification is determined by three factors: how large the lead time is relative to the median sampling interval, whether any ranks have missing data (which reduces confidence), and how many ranks share the same earliest spike time. A single rank that spiked at least one sampling interval before all others, with no missing ranks, gets a `high` confidence label. Ties or sparse evidence produce `medium` or `low`.

---

## Gap Analysis: The Hidden Memory Signal

The first-cause analysis looks at what `device_used_bytes` was doing across ranks. Gap analysis looks at something different: the divergence between what the PyTorch allocator thinks is reserved and what the device driver actually reports.

On CUDA and ROCm, these two numbers can diverge significantly, and that divergence is often more informative than the allocator counters alone. A large and growing gap between `device_used_bytes` and `allocator_reserved_bytes` usually means one of three things:

**Persistent drift** means the gap grows linearly over time, with a high R² on a linear regression. This signature often indicates non-allocator memory consumers accumulating in the background — custom CUDA kernels, NCCL communication buffers, or third-party libraries that allocate directly through the driver rather than through PyTorch's allocator.

**Transient spikes** means the gap grows suddenly at specific points and may or may not recover. This is detected by z-score: gaps that are more than two standard deviations above the mean for that run. The typical cause is a cuDNN workspace allocation, an XLA compilation artifact, or a large one-off operation that temporarily bypasses the normal allocator path.

**Fragmentation-like behavior** means the allocator's reserved pool is substantially larger than what it has allocated to live tensors — that is, `(reserved - allocated) / reserved` is high. This suggests the allocator is holding onto blocks it can't reuse effectively, inflating the reserved counter without serving live tensors.

Stormlog classifies all three using the same telemetry data, and each finding comes with a severity rating and specific remediation suggestions:

```python
from stormlog import MemoryAnalyzer
from stormlog.telemetry import load_telemetry_events

events = load_telemetry_events("artifacts/events_rank2.json")
analyzer = MemoryAnalyzer()
gap_findings = analyzer.analyze_memory_gaps(events)

for finding in gap_findings:
    print(f"[{finding.severity.upper()}] {finding.classification}")
    print(f"  {finding.description}")
    print(f"  Confidence: {finding.confidence:.2f}")
    for step in finding.remediation:
        print(f"  → {step}")
```

One important caveat: gap analysis requires `device_total_bytes` to be available in the telemetry. On CUDA and ROCm, this is populated from `torch.cuda.get_device_properties()`. On Apple Silicon MPS, the allocator and device counters stay closely coupled during live runs, which means the gap is effectively zero and the classifier doesn't produce meaningful results. Gap analysis is most useful on CUDA workloads — particularly multi-GPU training where driver-level fragmentation and collective communication buffers are common sources of hidden memory pressure.

---

## Collective Attribution: Connecting Spikes to NCCL Phases

Distributed training introduces a specific class of hidden memory consumer that single-GPU profiling never sees: the communication buffers used by NCCL for collective operations like `all_reduce`, `all_gather`, and `reduce_scatter`. These buffers are allocated directly through the driver, not through PyTorch's allocator, which means they show up in `device_used_bytes` but not in `allocator_reserved_bytes`.

Stormlog's collective attribution heuristic identifies when a hidden-memory spike correlates with a communication phase. It uses three signals together: the presence of collective marker events in the telemetry (events with context strings containing "nccl", "all_reduce", "collective", etc.), whether the spike appeared synchronously across multiple ranks within a configurable time window, and whether the gap z-score at that point was a statistical outlier.

When all three signals align, the result is attributed as `collective_confident`. When only some signals are present — for example, the spike is synchronized but no explicit markers exist — it produces `collective_likely` or `collective_suspect` with lower confidence:

```python
from stormlog import MemoryAnalyzer
from stormlog.telemetry import load_telemetry_events

# Load events from all ranks
all_events = []
for rank in range(4):
    all_events.extend(load_telemetry_events(f"artifacts/events_rank{rank}.json"))

analyzer = MemoryAnalyzer()
attributions = analyzer.analyze_collective_attribution(all_events)

for attribution in attributions:
    print(f"Rank {attribution.rank}: {attribution.classification} "
          f"(confidence {attribution.confidence:.2f})")
    print(f"  Interval: {attribution.interval_start_ns} → {attribution.interval_end_ns} ns")
    print(f"  Reasons: {', '.join(attribution.reason_codes)}")
    if attribution.evidence:
        print(f"  Gap: {attribution.evidence.peak_gap_bytes / (1024**2):.1f} MB")
        print(f"  Synchronized ranks: {attribution.evidence.synchronized_ranks} "
              f"of {attribution.evidence.expected_world_size}")
```

The sensitivity of collective attribution can be tuned via a preset — `low`, `medium`, or `high` — which adjusts the confidence thresholds, minimum gap sizes, and synchrony requirements. The default is `medium`, which works well for standard NCCL workloads. If you're seeing false positives from unrelated synchronized activity, use `low`. If you want to catch subtler communication patterns, use `high`.

---

## Using the TUI for Distributed Diagnostics

The Diagnostics tab in the TUI was built specifically for this use case. It can load artifacts from multiple ranks simultaneously, display per-rank timelines side by side, and surface first-cause indicators without requiring you to write any analysis code.

Launch the TUI and navigate to the Diagnostics tab:

```bash
stormlog
```

The **Load Artifacts** button accepts a comma-separated list of paths. You can point it at individual JSON or CSV files, or at entire artifact directories — it will discover and load all compatible telemetry files it finds:

```
artifacts/events_rank0.json,artifacts/events_rank1.json,artifacts/events_rank2.json,artifacts/events_rank3.json
```

Or if each rank wrote artifacts into its own subdirectory:

```
artifacts/rank0,artifacts/rank1,artifacts/rank2,artifacts/rank3
```

Stormlog will also synthesize telemetry events from `telemetry_timeline.json` files produced by `gpumemprof diagnose`, which means diagnostic bundles from multiple machines can be loaded directly without requiring a full tracker export.

Once loaded, the Diagnostics tab shows a rank table with per-rank metrics — samples collected, allocated delta, reserved delta, hidden gap magnitude, and whether any anomalies were detected. Selecting a rank in the table pins the timeline focus to that rank. The anomaly summary at the bottom surfaces the earliest detected anomaly across all ranks and the most severe one, which together give you a starting point for investigation.

The rank filter field accepts the same syntax as the Python API — `all`, `0,2`, or `0,4-7` for ranges — which is useful when you have a large-world-size run and want to focus on the subset of ranks that showed anomalies.

---

## Putting It Together: A Distributed Debugging Workflow

A practical distributed debugging workflow with Stormlog looks like this. Instrument each rank with `MemoryTracker`, letting it infer identity from the launcher environment. Run the training job. When it finishes — whether normally or via OOM — export each rank's artifact bundle to a shared location.

If the run was healthy, file the `stats.json` from each rank into your run registry. If the run failed or showed memory warnings, load all the artifacts into `gpumemprof analyze` or the TUI Diagnostics tab. Start with the first-cause analysis to identify which rank showed the earliest qualifying spike. Then narrow down to that rank's artifact and run gap analysis to understand whether the spike came from the allocator, from driver-level consumers, or from fragmentation. If it looks like a collective communication phase, check the collective attribution output to see whether the spike was synchronized across ranks and whether markers aligned with the timing.

The key property of this workflow is that none of these analysis steps require re-running the training job. The artifacts are the evidence, and the evidence is reloadable.

---

## What's Not Covered Here

Stormlog's distributed surface continues to evolve. The current implementation works well for identifying first-cause candidates in runs up to 64 ranks and has been validated against NCCL all-reduce patterns on CUDA. ROCm-specific runtime paths for gap analysis have distinct behaviors around the allocator-device divergence that may require tuning the gap ratio threshold. Cross-framework distributed runs (mixed PyTorch and TensorFlow ranks) are not yet supported in the merged timeline analysis.

The [documentation](https://stormlog.readthedocs.io/en/latest/) covers the full API surface for `MemoryAnalyzer`, `load_telemetry_events`, and the distributed analysis module. The [repository](https://github.com/Silas-Asamoah/stormlog) includes gap analysis and distributed analysis tests that demonstrate the expected behavior on synthetic multi-rank telemetry.
