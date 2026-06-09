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
 * Current released version of the stormlog package.
 *
 * Re-exported from the auto-generated `stormlog-version.ts`, which is refreshed
 * from PyPI at build time by `scripts/sync-version.mjs` (the `prebuild` hook),
 * so the site stays in sync with what teams actually install. The committed
 * value acts as an offline fallback.
 */
export { STORMLOG_VERSION } from "./stormlog-version";
