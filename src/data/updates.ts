import { Boxes, Gauge, type LucideIcon } from "lucide-react";

/**
 * Bump this whenever the highlighted updates change. The "What's new" dialog
 * uses it as the localStorage key so returning visitors only see the popup
 * again when there is genuinely something new to show.
 */
export const WHATS_NEW_VERSION = "2026-06-jax-inference";

export interface ProductUpdate {
  id: string;
  /** Short label rendered as a chip above the title. */
  tag: string;
  title: string;
  summary: string;
  highlights: string[];
  /** Primary install / invocation line, shown with a copy affordance. */
  command: string;
  /** Language hint for the secondary code sample. */
  codeLabel: string;
  code: string;
  icon: LucideIcon;
  /** Anchor used by the on-page section + dialog "Learn more" link. */
  href: string;
}

/**
 * Source of truth: stormlog `release/dev`.
 * - JAX support: `stormlog.jax` package, `jaxmemprof` CLI, `stormlog[jax]` extra
 *   (see docs/cookbook/jax.md, stormlog/jax/__init__.py).
 * - Inference profiling: `stormlog infer` command group for OpenAI-compatible
 *   endpoints (see docs/inference.md).
 *
 * JAX is the headline update and is intentionally listed first.
 */
export const PRODUCT_UPDATES: ProductUpdate[] = [
  {
    id: "jax-support",
    tag: "New framework",
    title: "JAX memory profiling, natively",
    summary:
      "Stormlog now tracks XLA allocations for JAX workloads with the same workflow you already use for PyTorch and TensorFlow — jit, pmap, and sharding included, across CPU, GPU, and TPU.",
    highlights: [
      "Profile jax.jit / XLA allocations through profile_context and the profile_function decorator",
      "jaxmemprof CLI for info, monitor, track, and diagnose sessions",
      "Multi-device aggregation across jax.sharding and jax.pmap on GPU and TPU",
      "OOM flight recorder, telemetry sinks, and rank-aware artifacts carried over from the core profiler",
    ],
    command: 'pip install "stormlog[jax]"',
    codeLabel: "python",
    code: `from stormlog.jax import JAXMemoryProfiler

profiler = JAXMemoryProfiler()

with profiler.profile_context("jitted_step"):
    y = fast_training_step(x)
    y.block_until_ready()

results = profiler.get_results()
print(f"Peak memory: {results.peak_memory_mb:.2f} MB")`,
    icon: Boxes,
    href: "#whats-new",
  },
  {
    id: "inference-profiling",
    tag: "New surface",
    title: "Profile any OpenAI-compatible endpoint",
    summary:
      "The new stormlog infer command group drives controlled load against Chat Completions endpoints — vLLM, SGLang, TensorRT-LLM, MLX-LM, or a hosted gateway — and reports latency, throughput, and device memory.",
    highlights: [
      "End-to-end latency and TTFT percentiles for streaming and non-streaming responses",
      "Requests/sec, output tokens/sec, and total tokens/sec under configurable concurrency",
      "Server usage metadata with tokenizer fallback for accurate token accounting",
      "Peak sampled device memory when system telemetry is available",
    ],
    command: "stormlog infer profile --base-url http://localhost:8000/v1",
    codeLabel: "bash",
    code: `stormlog infer profile \\
  --base-url http://localhost:8000/v1 \\
  --model Qwen/Qwen2.5-7B-Instruct \\
  --concurrency 1,4,8 \\
  --input-tokens 512,2048 \\
  --requests 50 \\
  --output artifacts/infer.jsonl`,
    icon: Gauge,
    href: "#whats-new",
  },
];

export interface WhatsNewMeta {
  eyebrow: string;
  title: string;
  description: string;
}

export const WHATS_NEW_META: WhatsNewMeta = {
  eyebrow: "Latest release",
  title: "What's new in Stormlog",
  description:
    "Two major additions land this cycle: native JAX memory profiling and a dedicated profiler for OpenAI-compatible inference endpoints.",
};
