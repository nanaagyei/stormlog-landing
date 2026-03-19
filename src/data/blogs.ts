export const BLOG_AUTHOR = "Stormlog Team";

export interface BlogRegistryEntry {
  slug: string;
  articleFile: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  featured?: boolean;
  relatedSlugs: string[];
}

export const BLOG_POSTS: BlogRegistryEntry[] = [
  {
    slug: "introducing-stormlog",
    articleFile: "stormlog_post1_launch_post.md",
    title: "Introducing Stormlog: GPU Memory Profiling That Stays Useful After the First Crash",
    description:
      "Meet Stormlog's launch story, the workflow problem it solves, and the five-step path from live visibility to exportable debugging evidence.",
    category: "Launch",
    thumbnail: "/images/stormlog-preview.png",
    featured: true,
    relatedSlugs: ["getting-started", "memory-leak-walkthrough"],
  },
  {
    slug: "getting-started",
    articleFile: "stormlog_post2_setup_guide.md",
    title: "Getting Started with Stormlog: Install, Instrument, and Run Your First Profile",
    description:
      "Set up Stormlog quickly, choose between the CLI, Python API, and TUI, and understand the import paths and install options that matter first.",
    category: "Setup Guide",
    thumbnail: "/images/tui-1.png",
    relatedSlugs: ["introducing-stormlog", "memory-leak-walkthrough"],
  },
  {
    slug: "memory-leak-walkthrough",
    articleFile: "stormlog_post3_walkthrough_post3.md",
    title: "Catching a Real Memory Leak: A Complete Stormlog Walkthrough on Apple Silicon",
    description:
      "Follow a full reproducible leak investigation from clean baseline to OOM boundary, then compare the broken and fixed runs with artifact-backed evidence.",
    category: "Walkthrough",
    thumbnail: "/images/tui-4.png",
    relatedSlugs: ["getting-started", "artifacts-explained"],
  },
  {
    slug: "artifacts-explained",
    articleFile: "stormlog_post4_artifacts.md",
    title: "Understanding Stormlog Artifacts: What Gets Exported and Why It Matters",
    description:
      "Break down event streams, diagnostic bundles, visual exports, and the practical workflow teams can use to keep memory evidence reviewable after the run ends.",
    category: "Artifacts",
    thumbnail: "/images/tui-5.png",
    relatedSlugs: ["memory-leak-walkthrough", "distributed-diagnostics"],
  },
  {
    slug: "distributed-diagnostics",
    articleFile: "stormlog_post5_distributed.md",
    title: "Distributed Diagnostics with Stormlog: Rank-Aware Analysis for Multi-GPU Runs",
    description:
      "Explore how Stormlog embeds distributed identity, aligns cross-rank telemetry, and surfaces first-cause signals across complex training jobs.",
    category: "Distributed Diagnostics",
    thumbnail: "/images/tui-6.png",
    relatedSlugs: ["artifacts-explained", "memory-leak-walkthrough"],
  },
];
