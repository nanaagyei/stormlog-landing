# Beyond Local Debugging: Distributed Diagnostics and Rank-Aware Analysis

Single-GPU memory debugging is already hard. You don't know which tensor grew, you don't know when it started, and your evidence disappears when the process exits.

Distributed training makes all of that worse. Now you have multiple ranks running simultaneously, each with its own memory state, and the failure mode you're hunting might only exist on one of them. The run fails on rank 2, but the logs from ranks 0, 1, and 3 are cluttered with unrelated output and don't tell you anything about what rank 2 was doing in the seconds before the crash. You're left making guesses about causality when what you actually need is a timeline that shows all four ranks simultaneously, aligned on the same clock, with anomalies flagged.

That's the problem distributed diagnostics in Stormlog is designed to solve. This post covers the full pipeline: how distributed identity is embedded into every telemetry event, how artifacts from multiple ranks can be analyzed together, and how the analyzer classifies what actually went wrong.

---

## Distributed Identity: Built Into Every Event

To compare ranks, merge timelines, or attribute a spike to one process, each sample needs a stable **distributed identity**: which job it belonged to, which rank produced it, and how that rank fits in the world size. Without that, separate files from separate processes are just unrelated traces.

Stormlog encodes that identity at **tracker initialization** and attaches it to every event the tracker emits. The four fields are `job_id`, `rank`, `local_rank`, and `world_size`. **Pass them explicitly** from your training script — for example using values from `torch.distributed`, your launcher (`LOCAL_RANK`, etc.), or your cluster metadata — so every export is unambiguous:

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

Some Stormlog releases still consult launcher environment variables when `rank` / `local_rank` / `world_size` are omitted, but that path is **easy to get wrong** (unset vars, wrapper scripts, partial Slurm/MPI exports). For reproducible distributed artifacts you should **always pass** these three fields explicitly from `torch.distributed` or your launcher; `job_id` is optional but useful for grouping files per run.

For **CLI** tracking, pass the same fields with flags:

```bash
gpumemprof track --duration 60 --rank 2 --local-rank 0 --world-size 4 --job-id run-001 \
  --output rank2.json --format json
```

Every telemetry record written by that tracker carries `job_id`, `rank`, `local_rank`, and `world_size` as **first-class schema fields** (not buried in opaque metadata), so artifacts from multiple ranks can be merged and compared without hand-annotating files afterward.

---

## Per-Rank Instrumentation in Practice

In a multi-GPU training loop, the typical pattern is one `MemoryTracker` per process, each reporting its own rank. The training code barely changes:

```python
import os
import torch
import torch.distributed as dist
from stormlog import MemoryTracker

dist.init_process_group(backend="nccl")
rank = dist.get_rank()
world_size = dist.get_world_size()
local_rank = int(os.environ.get("LOCAL_RANK", rank))
device = torch.device(f"cuda:{local_rank}")

tracker = MemoryTracker(
    device=device,
    sampling_interval=0.5,
    enable_alerts=True,
    enable_oom_flight_recorder=True,
    oom_dump_dir=f"artifacts/oom/rank_{rank}",
    job_id="distributed-run-001",
    rank=rank,
    local_rank=local_rank,
    world_size=world_size,
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

Cross-rank summaries (first-cause suspects, cluster onset, and related notes) run when the analyzer sees **more than one rank** in the combined event stream. A single `events_rank0.json` alone is only one rank — merge per-rank exports first, then analyze.

Combine events in Python and write one JSON file, or build the list in memory. Example: merge then call `gpumemprof analyze` on the combined file:

```python
import json
from stormlog.telemetry import load_telemetry_events, telemetry_event_to_dict

all_events = []
for rank in range(4):
    all_events.extend(load_telemetry_events(f"artifacts/events_rank{rank}.json"))

with open("artifacts/events_all_ranks.json", "w", encoding="utf-8") as f:
    json.dump([telemetry_event_to_dict(e) for e in all_events], f, indent=2)
```

```bash
gpumemprof analyze artifacts/events_all_ranks.json --output cross_rank_analysis.json --format json
```

When the input contains multiple ranks, the human-readable summary includes a distributed analysis section similar to:

```
Distributed Analysis:
Participating ranks: 0, 1, 2, 3
Missing ranks: none
Cluster onset (aligned ns): 1700000002000000000
Top first-cause suspect: rank 2 (high)
Evidence: timestamp_ns=1700000001900000000, lead_ns=100000000, delta=384MB
```

What this means: rank 2 showed a qualifying spike before the cluster onset — here, 100 ms earlier. The cluster onset is derived from per-rank “first spike” times across the merged timeline; the lead time is part of the evidence for ranking suspects.

From Python, `MemoryAnalyzer.generate_optimization_report()` is the umbrella API the CLI uses for telemetry-backed analysis: despite the historical name, the useful pieces for distributed runs are the **`cross_rank_analysis`**, **`gap_analysis`**, and **`collective_attribution`** sections (not a separate “optimizer” product).

```python
from stormlog import MemoryAnalyzer
from stormlog.telemetry import load_telemetry_events

all_events = []
for rank in range(4):
    all_events.extend(load_telemetry_events(f"artifacts/events_rank{rank}.json"))

analyzer = MemoryAnalyzer()
report = analyzer.generate_optimization_report(events=all_events)

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

On CUDA and ROCm, these two numbers can diverge significantly, and that divergence is often more informative than the allocator counters alone. A large and growing gap between **device-reported usage** and **allocator-reserved** memory usually means one of three things:

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

Distributed training introduces a specific class of hidden memory consumer that single-GPU profiling often misses: communication buffers used for collectives such as `all_reduce`, `all_gather`, and `reduce_scatter`. Much of that memory is **outside PyTorch's caching allocator**: it still shows up in **device-level usage**, while **allocator-reserved** may not move in the same way — the same “hidden gap” story as in the previous section.

Stormlog's **collective attribution** step looks for gap spikes that look like a **coordinated communication phase** rather than a single-rank bug. Conceptually it:

1. **Detects gap spikes** — points where the allocator-vs-device divergence jumps enough to count as an outlier for that run (robust z-score style signal).
2. **Checks cross-rank timing** — whether a similar jump lines up across ranks within a short time window (synchrony), which is what you expect when a collective lands everywhere at once.
3. **Uses optional context** — if your tracker events include `context` strings that mention collectives (for example NCCL-related markers), overlapping spikes with that context strengthen the attribution.

Those ingredients are combined into a **confidence score**, which is bucketed into labels such as `collective_confident`, `collective_likely`, and `collective_suspect`. Each result also carries **reason codes** for auditing (for example synchrony vs weak marker signal). The API exposes tunable sensitivity presets (`low` / `medium` / `high`) that adjust thresholds for gap size, synchrony, and outlier detection — `medium` is the default; use `low` for a stricter, narrower pass when unrelated synchronized work creates noise, or `high` when you want a broader, more sensitive pass.

```python
from stormlog import MemoryAnalyzer
from stormlog.telemetry import load_telemetry_events

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

---

## Using the TUI for Distributed Diagnostics

The Diagnostics tab can load artifacts from multiple ranks simultaneously, show per-rank summaries, and surface first-cause indicators without requiring you to write analysis code.

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

Stormlog can also synthesize telemetry events from `telemetry_timeline.json` files produced by `gpumemprof diagnose`, which means diagnostic bundles from multiple machines can be loaded directly without requiring a full tracker export.

Once loaded, the Diagnostics tab shows a rank table with per-rank metrics — samples collected, allocated delta, reserved delta, hidden gap magnitude, and whether any anomalies were detected. Selecting a rank in the table pins the timeline focus to that rank. The anomaly summary surfaces the earliest detected anomaly across all ranks and the most severe one, which together give you a starting point for investigation.

The rank filter field accepts syntax such as `all`, `0,2`, or `0,4-7` for ranges — useful when you have a large-world-size run and want to focus on the subset of ranks that showed anomalies.

---

## Putting It Together: A Distributed Debugging Workflow

A practical distributed debugging workflow with Stormlog looks like this: **instrument each rank** with its own `MemoryTracker`, passing **`job_id`, `rank`, `local_rank`, and `world_size` explicitly**, run the training job, and export each rank's artifacts to a shared location (whether the job ends normally or hits OOM).

If the run was healthy, archive summaries per rank. If the run failed or showed memory warnings, **merge rank exports** (or load multiple paths in the TUI) and run analysis. Start with first-cause output to see which rank led the cluster. Then drill into that rank's series for gap findings — allocator growth vs driver-level usage vs fragmentation-like reserve inflation. If timing and gap shape look like a collective, use collective attribution output alongside your own knowledge of the step (synchrony and markers are heuristics, not proof).

The useful property of this workflow is that inspection and classification can happen **from saved artifacts**, without re-running the training job, as long as you captured identity correctly at collection time.

---

## What's Not Covered Here

Stormlog's distributed surface continues to evolve. Cross-framework merged timelines (mixed PyTorch and TensorFlow ranks in one analysis pass) are not the primary focus of the current tooling — treat single-framework exports as the supported path unless your versions say otherwise.

The [documentation](https://stormlog.readthedocs.io/en/latest/) covers installation, CLI usage, the telemetry schema, and the `MemoryAnalyzer` / `load_telemetry_events` APIs. The [repository](https://github.com/Silas-Asamoah/stormlog) contains tests and examples for gap analysis and distributed analysis on synthetic multi-rank telemetry.
