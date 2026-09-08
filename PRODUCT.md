# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — the ML engineer mid-failure.** A researcher or ML engineer whose training run just died at 3am with a CUDA OOM, or is quietly leaking memory across epochs. They are currently stitching together `nvidia-smi`, `torch.cuda.memory_stats()`, and print statements, and they have no record of what happened once the process is gone. They decide alone and install immediately — no procurement, no meeting.

**Primary — the ML platform / infra team.** A team standardizing profiling across many runs and many people. They evaluate on fit with an existing stack: CI integration, exportable artifacts, distributed/rank-aware runs, and whether adopting it forces anyone to rewrite training code. They decide for others, so they need evidence, not enthusiasm.

Secondary audiences (address only where it costs the primaries nothing): OSS developers deciding whether to use, star, and contribute; inference/serving owners running vLLM, SGLang, TensorRT-LLM, or MLX-LM endpoints who need latency, throughput, and device-memory numbers to size deployments.

## Product Purpose

Stormlog is an open-source GPU memory profiler for PyTorch, TensorFlow, and JAX teams. It gives real-time visibility into GPU memory while a workload is running, detects leaks and anomalies, and exports the evidence as artifacts that outlive the process.

This repository is the **landing page and blog** for that product — not the profiler itself. The profiler lives at https://github.com/Silas-Asamoah/stormlog.

Success for this site: an ML engineer arrives from a search, a README, or a link, understands within one screen that Stormlog sees what their current tools cannot, and runs `pip install stormlog`. A platform lead arrives with a harder question — does this fit our pipeline, our distributed runs, our CI — and finds enough concrete surface (interfaces, exports, docs, source) to answer it without a call.

## Positioning

The user confirmed all four differentiators hold together; the position is the combination, not any single one:

1. **Evidence that survives the crash.** JSON, CSV, and HTML artifacts you can reload, compare, and ship into review threads and CI. `nvidia-smi` shows you a number that is gone the moment the process dies.
2. **Live monitoring and diagnosis in the same loop.** Thresholds, alerts, and leak/anomaly detection fire while training is still alive, so the engineer acts mid-run instead of reading a post-mortem.
3. **Training and inference in one tool.** The same profiler covers training memory and load-driven profiling of OpenAI-compatible Chat Completions endpoints — one mental model across both halves of the lifecycle.
4. **Near-zero adoption cost.** `pip install stormlog`, then one decorator, one context manager, or one CLI command. Runs on CPU for dry runs. Three interfaces (CLI, Python API, Textual TUI) so it fits whatever workflow already exists.

The honest competitive frame is `nvidia-smi` + `torch.cuda.memory_stats()` + PyTorch Profiler + print statements — the improvised stack, not a rival product.

## Operating Context

- The moment of need is a failure or a suspicion: an OOM crash, a run that gets slower and heavier each epoch, a batch size that used to fit and no longer does, a distributed job where one rank misbehaves.
- Work happens in a terminal, over SSH, on a remote GPU box or cluster node. A browser is often not available where the training runs — this is why the TUI exists.
- Three entry surfaces, chosen by workflow: **CLI** (`stormlog monitor`, `stormlog export`, `stormlog infer profile`) for automation and quick sessions; **Python API** (decorators, context managers, programmatic sessions) for instrumentation inside training code; **Textual TUI** for interactive inspection without leaving the shell.
- Outputs travel: exported artifacts land in CI pipelines, PR review threads, and offline analysis, and are reloaded later to compare runs without reproducing the failure.
- Distribution is PyPI; documentation is Read the Docs; development, issues, and contribution happen in the open on GitHub.

## Capabilities and Constraints

**Confirmed product capabilities**
- Real-time GPU allocation, peak, and reserved memory tracking during live runs.
- Warning and critical threshold alerts.
- Leak detection and suspicious-growth signals; anomaly filtering with rank-aware diagnostics for distributed runs.
- Artifact capture, reload, and comparison across sessions.
- Timeline plots and HTML reports; JSON and CSV exports.
- Frameworks: PyTorch, TensorFlow, JAX/XLA.
- CPU-compatible workflows so profiling routines can be prepared and tested before moving to GPU infrastructure.
- `stormlog infer profile` — controlled load against any OpenAI-compatible Chat Completions endpoint, reporting end-to-end latency and TTFT percentiles (streaming and non-streaming), requests/sec and token throughput under configurable concurrency, token accounting from server usage metadata with a tokenizer fallback, and peak sampled device memory where telemetry is available. Verified against vLLM, SGLang, TensorRT-LLM, MLX-LM, and hosted gateways.
- MLflow and Weights & Biases exporters for experiment tracking (as of 0.3.9).

**Site constraints and mechanics**
- Next.js 16 / React 19 / TypeScript 5 / Tailwind 4 app; deployed to Vercel, gated on GitHub Actions CI (`lint`, `typecheck`, `build`) — feature branches do not auto-deploy.
- Copy is centralized in `src/data/content.ts`; navigation and external links in `src/data/navigation.ts`. Design work should edit content there, not inline in components.
- The displayed package version is auto-generated into `src/data/stormlog-version.ts` from PyPI at build time (`scripts/sync-version.mjs`); the committed value is an offline fallback. Never hardcode a version in a component.
- The "What's New" feed is data-driven from `src/data/updates.json`, validated against `src/data/updates.schema.json` and synced by `scripts/generate-updates.mjs`. Release content arrives via bot PRs (`bot/sync-stormlog-content`), so any redesign must keep consuming that schema rather than hardcoding release copy.
- Blog articles are markdown files in `articles/`, registered in `src/data/blogs.ts`.
- Motion is GSAP (ScrollTrigger) plus Framer Motion, with an existing `use-reduced-motion` hook. Theming is `next-themes`.

**Terminology (use exactly)**
- "GPU memory profiler", not "monitor" or "dashboard". "Artifacts" for exported evidence. "TUI" (Textual TUI). "Leak detection", "anomaly signals", "thresholds". "Rank-aware" for distributed. `stormlog infer profile` for inference profiling.

**Known open item:** `src/data/blogs.ts` and `src/app/blogs/page.tsx` reference `/images/stormlog-preview.png`, which is deleted in the working tree. Broken until repointed.

## Brand Commitments

- **Name:** Stormlog. Always one word, capital S. The CLI is lowercase `stormlog`.
- **Logo (confirmed, binding):** the new stacked-layers mark — three offset isometric layers, the middle one accented — in near-black with a mint/spring green accent. Files are in the working tree (`public/stormlog_newlogo_1.png`, `public/stormlog_newlogo_5.png`, `public/images/stormlog_newlogo_2..4.png`) with regenerated favicons, apple-touch icon, and `site.webmanifest`. This is the committed identity: future work should wire it into the header, footer, and OG imagery and retire the old `stormlog-icon` assets. None of the new files are referenced by code yet.
- **Voice:** technical, evidence-first, no hype. Speaks to engineers who have already been burned. Existing copy states mechanisms and outcomes ("See GPU memory before it breaks your training") rather than adjectives; preserve that register.
- **Open-source posture is part of the brand.** Maintainers, repository, issues, and contribution paths are shown publicly and by name.

## Evidence on Hand

**Real and citable**
- `public/images/tui-1.png` … `tui-7.png` — genuine captures of the shipped Textual TUI (overview, PyTorch profiles, live monitoring, visualization exports, diagnostics, CLI actions). Confirmed valid proof assets.
- `public/images/overview.mp4` / `overview.mov` — product overview video.
- Real maintainers, named with GitHub profiles: Prince Agyei Tuffour (@nanaagyei), Silas Asamoah (@Silas-Asamoah), Derrick Dwamena (@dwamenad). Contributors are fetched live from the GitHub API at runtime.
- Public artifacts: the GitHub repository, Read the Docs documentation, the PyPI package, and the release feed in `updates.json` (currently 0.3.9, MLflow exporter).
- Six published blog articles in `articles/`.

**Illustrative, not measured — must never be presented as benchmarks**
- The workflow section's before/after figures ("Peak allocated: 2.04 GB → 0.09 GB", "OOM at batch_size=64 → stable again", "50 epochs completed, zero OOM interruptions") and the sample TUI/CLI output blocks in `WORKFLOW_STEPS` are plausible examples, not results from a run. Keep them visibly framed as examples. If a real benchmark is ever produced, it replaces these and may then be cited as fact.

**Absent — do not fabricate**
- No users, testimonials, logos, adoption counts, download numbers, star counts, case studies, or third-party benchmarks exist. No pricing, licensing tiers, or enterprise offering. Any future design that wants social proof must ask for real material or do without it.

## Product Principles

1. **Evidence over impression.** Every claim on the site should be traceable to a real artifact — a screenshot, the docs, the repository, the package. Where only an illustration exists, it reads as an illustration.
2. **Show the terminal, don't translate it.** The product's native habitat is a shell on a remote GPU box. Real CLI and TUI surfaces are the strongest asset this project has; a landing page that hides them behind abstraction sells worse and lies more.
3. **Both primaries, one page.** The engineer needs to feel understood in the first screen and reach `pip install` fast. The platform lead needs depth — interfaces, exports, distributed behavior, CI fit — available further down without slowing the first path.
4. **Adoption cost is the pitch.** One install, one decorator, works on CPU. Anything that makes Stormlog look like a commitment rather than a try weakens the strongest argument it has.
5. **Content stays data-driven.** Version, release notes, contributors, and blog registry are generated or fetched. Design changes must keep those pipelines intact rather than freezing a moment's copy into components.

## Accessibility & Inclusion

WCAG 2.2 AA is the stated baseline: AA contrast in both themes, full keyboard operability, and visible focus. Motion is a specific risk here — the site leans on GSAP ScrollTrigger and Framer Motion — so all of it must degrade cleanly under `prefers-reduced-motion`, using the existing `src/hooks/use-reduced-motion.ts`.
