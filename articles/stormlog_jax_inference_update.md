# JAX Support Lands in Stormlog — Plus a New Inference Endpoint Profiler

Stormlog started as a memory-profiling toolkit for PyTorch and TensorFlow. This release widens that surface in two directions teams kept asking for: **native JAX memory profiling**, and a dedicated profiler for **OpenAI-compatible inference endpoints**.

Both additions follow the same principle the project started with — move from "what is using memory?" or "what is my endpoint doing under load?" to saved artifacts and shareable diagnostics without switching tools. Here's what shipped and how to use it.

---

## JAX, Profiled Like Everything Else

JAX runs on XLA, and XLA's allocation and caching behavior is exactly the kind of thing that's hard to see from the outside. Stormlog now tracks those allocations directly, so a `jax.jit` function gets the same treatment as a PyTorch training step or a TensorFlow graph.

The new APIs live under `stormlog.jax`, and the framework-specific dependencies install through a dedicated extra:

```bash
pip install "stormlog[jax]"
```

JAX-specific APIs are namespaced so they never collide with the PyTorch or TensorFlow surfaces:

```python
from stormlog.jax import JAXMemoryProfiler
```

### Profiling a jitted function

XLA compilation and caching are central to JAX performance and memory behavior. You can profile a `jax.jit` function identically to standard JAX operations — Stormlog tracks the underlying XLA allocations either way. Remember to `block_until_ready()` so you're measuring real device work rather than an async dispatch that hasn't landed yet:

```python
import jax
import jax.numpy as jnp
from stormlog.jax import JAXMemoryProfiler

profiler = JAXMemoryProfiler()

@jax.jit
def fast_training_step(x):
    return jnp.dot(x, x)

with profiler.profile_context("jitted_step"):
    x = jnp.ones((1000, 1000))
    y = fast_training_step(x)
    y.block_until_ready()

results = profiler.get_results()
print(f"Peak memory: {results.peak_memory_mb:.2f} MB")
```

### Decorating functions for global instrumentation

For library code or deep architectures where context managers are intrusive, the `profile_function` decorator instruments a JAX function wherever it's called:

```python
from stormlog.jax import profile_function
import jax.numpy as jnp

@profile_function(name="custom_matmul")
def custom_matmul(a, b):
    res = jnp.dot(a, b)
    res.block_until_ready()
    return res
```

### Devices, sharding, and pmap

Stormlog attributes memory back to JAX devices. On multi-GPU or TPU setups using `jax.sharding` or `jax.pmap`, it aggregates memory profiles across the requested device scopes. Match the install to your runtime:

- **CUDA** — requires `jax[cuda12]`
- **TPU** — requires `jax[tpu]`
- **CPU** — standard `jax`, used automatically by `jaxmemprof` when no accelerators are present

### A CLI that mirrors the rest of Stormlog

JAX gets its own `jaxmemprof` command line tool, with the same verbs you already know from the PyTorch and TensorFlow CLIs:

```bash
jaxmemprof info
jaxmemprof monitor --interval 1.0 --threshold 4000
jaxmemprof track --duration 60 --output jax_track.json
jaxmemprof diagnose jax_track.json
```

The heavier operational features carry straight over: telemetry sink segments, distributed identity (`job_id`, `rank`, `local_rank`, `world_size`), and the OOM flight recorder that dumps a ring buffer of events when a run trips its threshold.

### Offline analytics from exported logs

If you've exported a tracking log with the CLI, you can pipe it back into the Python API for offline heuristics like fragmentation checks or leak detection:

```python
from stormlog.jax.analyzer import MemoryAnalyzer

analyzer = MemoryAnalyzer()
findings = analyzer.analyze_memory_gaps(events)

for finding in findings:
    print(f"Gap detected: {finding.severity}")
```

---

## Inference Profiling for OpenAI-Compatible Endpoints

The second addition answers a different question: not "how much memory does my training step use?" but "what is my serving endpoint actually doing under load?"

The new `stormlog infer` command group drives controlled traffic against any endpoint that speaks the OpenAI Chat Completions request shape. That deliberately spans a lot of backends — PyTorch, vLLM, SGLang, TensorRT-LLM, MLX-LM, or a hosted gateway. It's intentionally separate from `gpumemprof` and `tfmemprof`, because the thing you're measuring is the endpoint's behavior, not a local process.

### Profiling an endpoint

```bash
stormlog infer profile \
  --base-url http://localhost:8000/v1 \
  --model Qwen/Qwen2.5-7B-Instruct \
  --concurrency 1,4,8 \
  --input-tokens 512,2048 \
  --output-tokens 128,512 \
  --requests 50 \
  --output artifacts/infer.jsonl
```

The profiler sweeps a matrix of workload cases — concurrency, prompt token target, output token cap, and streaming or non-streaming mode. `--requests` sets the total measured request count per case (shared across workers), or use `--duration` to run each case for a fixed wall-clock window. Warmup requests are recorded but excluded from analysis with `--warmup-requests`.

### Reading the report

```bash
stormlog infer analyze artifacts/infer.jsonl
```

The analysis covers the metrics you'd actually take into a capacity or regression conversation:

- End-to-end latency percentiles
- TTFT percentiles and first streamed chunk latency for streaming responses
- Requests/sec
- Output tokens/sec and total tokens/sec
- Failure rate
- Peak sampled device memory when system telemetry is available

### Token accounting you can trust

Server usage metadata is preferred whenever the endpoint returns it. When it's missing, Stormlog falls back to the configured tokenizer and records the source on every request event — `server_usage`, `tiktoken`, `transformers`, `estimated`, or `unknown` — so you always know how a token count was derived. For streaming, it requests OpenAI-style usage with `stream_options.include_usage` by default, with `--no-stream-usage` available for endpoints that reject that field.

---

## Installing the New Surfaces

Both additions are opt-in extras, so you only pull the dependencies you need:

```bash
pip install "stormlog[jax]"              # JAX memory profiling
pip install "stormlog[infer-tokenizers]" # inference tokenizer fallbacks
pip install "stormlog[all]"              # everything: viz, TUI, torch, tf, jax, W&B, infer
```

`stormlog[all]` installs every runtime extra at once if you'd rather not think about it.

---

## Why It Matters

The throughline across both features is the same one Stormlog launched with: keep the debugging loop tractable and the evidence durable. JAX users get real visibility into XLA allocations with the workflow, CLI, and artifact format the rest of the toolkit already uses. Teams running inference get a way to measure latency, throughput, and device memory against a real endpoint and save those numbers for the next review.

Update with `pip install --upgrade "stormlog[all]"`, point `jaxmemprof` at your next JAX run, or aim `stormlog infer profile` at a serving endpoint — and as always, the artifacts are yours to keep.
