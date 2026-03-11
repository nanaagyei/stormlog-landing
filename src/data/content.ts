import {
  Activity,
  BadgeCheck,
  Braces,
  ChartColumnIncreasing,
  Cpu,
  FileJson2,
  MonitorPlay,
  Package,
  Radar,
  ScanSearch,
  ShieldAlert,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";

export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  supportLabels: string[];
  floatingTags: string[];
  installCommand: string;
}

export const HERO_CONTENT: HeroContent = {
  eyebrow: "Formerly GPU Memory Profiler",
  title: "See GPU memory before it breaks your training.",
  description:
    "Stormlog gives PyTorch and TensorFlow teams real-time GPU memory visibility, leak detection, diagnostics, and exportable timelines across CLI, Python API, and Textual TUI workflows.",
  supportLabels: [
    "PyTorch and TensorFlow",
    "CLI + Python API",
    "Textual TUI",
    "JSON, CSV, and HTML exports",
  ],
  floatingTags: [
    "Live leak detection",
    "Artifact diagnostics",
    "Timeline exports",
    "Threshold alerts",
  ],
  installCommand: "pip install gpu-memory-profiler",
};

export interface EcosystemBadge {
  label: string;
  tone: "framework" | "workflow" | "export";
}

export const ECOSYSTEM_BADGES: EcosystemBadge[] = [
  { label: "PyTorch", tone: "framework" },
  { label: "TensorFlow", tone: "framework" },
  { label: "CLI", tone: "workflow" },
  { label: "Python API", tone: "workflow" },
  { label: "Textual TUI", tone: "workflow" },
  { label: "JSON export", tone: "export" },
  { label: "CSV export", tone: "export" },
  { label: "HTML reports", tone: "export" },
];

export interface EcosystemPillar {
  title: string;
  description: string;
}

export const ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    title: "Built for ML workflows",
    description:
      "Profile live training runs, investigate artifact captures, and iterate without switching between disconnected tools.",
  },
  {
    title: "More than one interface",
    description:
      "Use Stormlog from the command line, inside Python, or through the interactive TUI depending on how your team works.",
  },
  {
    title: "Exportable evidence",
    description:
      "Ship JSON, CSV, and HTML artifacts into debugging reviews, CI pipelines, or offline analysis without re-running experiments.",
  },
];

export interface CapabilityItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface CapabilityGroup {
  eyebrow: string;
  title: string;
  description: string;
  items: CapabilityItem[];
}

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    eyebrow: "Live visibility",
    title: "Watch memory shift while training is still running.",
    description:
      "Track allocation, peak usage, and reserved memory in one place instead of stitching together shell commands and printouts.",
    items: [
      {
        title: "Real-time monitoring",
        description:
          "Follow GPU allocation as it changes mid-epoch, not after the crash report lands.",
        icon: Radar,
      },
      {
        title: "Threshold alerts",
        description:
          "Apply warning and critical limits so risky runs surface immediately instead of after hours of wasted compute.",
        icon: ShieldAlert,
      },
      {
        title: "Interactive TUI",
        description:
          "Inspect platform info, live tracking, exports, and diagnostics without opening a browser.",
        icon: MonitorPlay,
      },
    ],
  },
  {
    eyebrow: "Actionable diagnostics",
    title: "Pinpoint growth patterns before they become OOM crashes.",
    description:
      "Move from vague symptoms to concrete signals you can act on, including suspicious allocation growth and distributed anomalies.",
    items: [
      {
        title: "Leak detection",
        description:
          "Identify suspicious growth patterns and isolate where memory starts drifting run over run.",
        icon: ScanSearch,
      },
      {
        title: "Artifact diagnostics",
        description:
          "Load exported snapshots and compare them later to trace distributed or intermittent issues with context intact.",
        icon: BadgeCheck,
      },
      {
        title: "Timeline views",
        description:
          "Generate timeline plots and HTML artifacts to show how memory behaved across the full workload.",
        icon: ChartColumnIncreasing,
      },
    ],
  },
  {
    eyebrow: "Flexible workflows",
    title: "Fit Stormlog into the stack you already have.",
    description:
      "Adopt the profiler incrementally, from quick CLI sessions to deeper instrumentation in Python-heavy training code.",
    items: [
      {
        title: "CLI automation",
        description:
          "Start monitoring or diagnostics sessions from the terminal without reworking your whole training loop.",
        icon: TerminalSquare,
      },
      {
        title: "Python hooks",
        description:
          "Use decorators, context managers, and programmatic sessions when you need tighter profiling control.",
        icon: Braces,
      },
      {
        title: "CPU-compatible workflows",
        description:
          "Prepare and test profiling routines before moving them onto production GPU infrastructure.",
        icon: Cpu,
      },
    ],
  },
];

export interface SpotlightContent {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  chips: string[];
  image: string;
}

export const SPOTLIGHT_CONTENT: SpotlightContent = {
  eyebrow: "Spot issues faster",
  title: "Catch leaks, rank anomalies, and regressions before they waste compute.",
  description:
    "Stormlog turns raw allocation data into signals your team can review. Load artifacts, compare suspicious runs, filter by anomaly reason, and export proof for later triage.",
  bullets: [
    "Investigate distributed runs with rank-aware diagnostics",
    "Review artifacts from prior sessions without reproducing the entire failure",
    "Move from symptoms to concrete next steps with exportable traces",
  ],
  chips: [
    "Anomaly signals",
    "Artifact reloads",
    "Distributed diagnostics",
    "Review-ready exports",
  ],
  image: "/images/tui-6.png",
};

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  code: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: "Instrument",
    description:
      "Add Stormlog to the workload you care about, from lightweight decorators to deeper session-based profiling.",
    code: `from stormlog import profile

@profile(track_tensors=True, detect_leaks=True)
def train_epoch(model, dataloader):
    for batch in dataloader:
        loss = model(batch)
        loss.backward()`,
  },
  {
    step: 2,
    title: "Observe",
    description:
      "Launch the TUI or a CLI session to watch allocation, peak memory, and alerts while the training run is alive.",
    code: `$ stormlog monitor --pid 12345
┌─ Live GPU Memory ──────────────────────┐
│ Allocated  16.2 / 24.5 GB              │
│ Peak       19.8 / 24.5 GB              │
│ Alerts     None                        │
└────────────────────────────────────────┘`,
  },
  {
    step: 3,
    title: "Diagnose",
    description:
      "Inspect spikes, suspicious growth, and anomaly indicators before the next restart cycle begins.",
    code: `[WARN] suspicious growth detected
tensor: grad_cache
change: +128MB over 50 iterations
signal: growth beyond threshold`,
  },
  {
    step: 4,
    title: "Export",
    description:
      "Ship artifacts into CI, review threads, or follow-up debugging sessions instead of relying on memory alone.",
    code: `$ stormlog export --format json --output run.json
$ stormlog export --format html --output run.html

✓ timeline written
✓ diagnostics artifact saved`,
  },
  {
    step: 5,
    title: "Optimize",
    description:
      "Use the evidence to fix leaks, stabilize batch sizes, and avoid repeat OOM failures in future runs.",
    code: `Before: OOM at batch_size=64
After: stable at batch_size=96
Memory savings: 2.1 GB (-26%)

✓ 50 epochs completed
✓ zero OOM interruptions`,
  },
];

export interface TuiGalleryItem {
  title: string;
  description: string;
  image: string;
  tag: string;
}

export const TUI_GALLERY_ITEMS: TuiGalleryItem[] = [
  {
    title: "Overview",
    description:
      "Orient new users with platform details, keyboard shortcuts, and a fast path into every Stormlog surface.",
    image: "/images/tui-1.png",
    tag: "Quick start",
  },
  {
    title: "Guided entry point",
    description:
      "Keep the learning curve low with a structured overview screen that points directly to monitoring, diagnostics, and export flows.",
    image: "/images/tui-2.png",
    tag: "Onboarding",
  },
  {
    title: "PyTorch profiles",
    description:
      "Review captured PyTorch sessions, including peak usage and recorded call activity, without leaving the TUI.",
    image: "/images/tui-3.png",
    tag: "PyTorch",
  },
  {
    title: "Live monitoring",
    description:
      "Start tracking, apply thresholds, force cleanups, and export data from a live control surface built for debugging sessions.",
    image: "/images/tui-4.png",
    tag: "Live control",
  },
  {
    title: "Visualization exports",
    description:
      "Generate timeline plots and HTML output when you need a sharable view of how memory behaved across a run.",
    image: "/images/tui-5.png",
    tag: "Artifacts",
  },
  {
    title: "Diagnostics",
    description:
      "Load live or saved artifacts, filter anomaly signals, and compare distributed runs with context that survives after failure.",
    image: "/images/tui-6.png",
    tag: "Anomaly review",
  },
  {
    title: "CLI and actions",
    description:
      "Trigger common commands and sample scenarios from a terminal-native workspace that still feels structured.",
    image: "/images/tui-7.png",
    tag: "Terminal-first",
  },
];

export interface Maintainer {
  name: string;
  github: string;
  avatar: string;
  role: string;
}

export const MAINTAINERS: Maintainer[] = [
  {
    name: "Prince Agyei Tuffour",
    github: "nanaagyei",
    avatar: "https://github.com/nanaagyei.png",
    role: "Core Maintainer",
  },
  {
    name: "Silas Asamoah",
    github: "Silas-Asamoah",
    avatar: "https://github.com/Silas-Asamoah.png",
    role: "Core Maintainer",
  },
  {
    name: "Derrick Dwamena",
    github: "dwamenad",
    avatar: "https://github.com/dwamenad.png",
    role: "Core Maintainer",
  },
];

export interface OpenSourceProofItem {
  title: string;
  description: string;
  href: "docs" | "github" | "pypi" | "issues";
  icon: LucideIcon;
}

export const OPEN_SOURCE_PROOF: OpenSourceProofItem[] = [
  {
    title: "Documentation",
    description:
      "Installation, architecture, examples, and TUI guidance are already part of the public workflow.",
    href: "docs",
    icon: FileJson2,
  },
  {
    title: "Repository",
    description:
      "Stormlog is developed in the open, with code, issue tracking, and contribution paths visible to contributors.",
    href: "github",
    icon: Activity,
  },
  {
    title: "Package distribution",
    description:
      "The current published package remains available on PyPI while the rename transition to Stormlog stays explicit.",
    href: "pypi",
    icon: Package,
  },
];

export interface FinalCtaContent {
  eyebrow: string;
  title: string;
  description: string;
}

export const FINAL_CTA: FinalCtaContent = {
  eyebrow: "Ready to debug with context?",
  title: "Trace memory clearly, export evidence, and keep training runs stable.",
  description:
    "Use the docs to get started, inspect the repository, or install the current PyPI package while the Stormlog rename rolls forward.",
};
