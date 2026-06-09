export const NAV_ITEMS = [
  { label: "Overview", href: "#overview" },
  { label: "What's New", href: "#whats-new" },
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "TUI", href: "#tui" },
  { label: "Open Source", href: "#open-source" },
] as const;

export const EXTERNAL_LINKS = {
  github: "https://github.com/Silas-Asamoah/stormlog",
  docs: "https://stormlog.readthedocs.io/en/latest/index.html",
  pypi: "https://pypi.org/project/stormlog/",
  releases: "https://github.com/Silas-Asamoah/stormlog/releases",
  contributing: "https://github.com/Silas-Asamoah/stormlog/blob/main/CONTRIBUTING.md",
  issues: "https://github.com/Silas-Asamoah/stormlog/issues",
} as const;

/**
 * Current released version of the stormlog package. Keep this in sync with the
 * latest tag on the stormlog repository so the site reflects what teams install.
 */
export const STORMLOG_VERSION = "0.3.5";
