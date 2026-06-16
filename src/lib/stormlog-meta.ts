import { STORMLOG_VERSION as FALLBACK_VERSION } from "@/data/stormlog-version";

/**
 * Runtime resolution of the latest published stormlog release.
 *
 * Why runtime (and not just build-time)?
 * - `scripts/sync-version.mjs` already bakes the latest PyPI version into
 *   `stormlog-version.ts` at build time, but that only runs on deploy.
 *   Stormlog releases on its own cadence, and the landing site doesn't
 *   redeploy on every release — so the displayed version can drift.
 * - Next.js ISR (`next: { revalidate }`) gives us a free, edge-cached
 *   refresh: the page is served instantly from cache, and a background
 *   fetch keeps the value within an hour of PyPI.
 *
 * Order of preference:
 *   1. PyPI JSON   (https://pypi.org/pypi/stormlog/json) — what users `pip install`
 *   2. GitHub tags (Silas-Asamoah/stormlog)              — fallback if PyPI is down
 *   3. Baked-in    (`STORMLOG_VERSION` from build time)  — offline / build safety
 *
 * This function is intentionally tolerant: it never throws, and any failure
 * silently falls back to the build-time constant.
 */

const PYPI_URL = "https://pypi.org/pypi/stormlog/json";
const GITHUB_TAGS_URL = "https://api.github.com/repos/Silas-Asamoah/stormlog/tags";

// Refresh the cache no more than once per hour. Picks up new PyPI releases
// in the background without hammering upstream.
export const STORMLOG_META_REVALIDATE_SECONDS = 60 * 60;

const SEMVER_LIKE = /^\d+\.\d+\.\d+([.\-+][0-9A-Za-z.\-+]*)?$/;

export interface StormlogMeta {
  version: string;
  source: "pypi" | "github" | "fallback";
}

function normalize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/^v/, "");
  return SEMVER_LIKE.test(cleaned) ? cleaned : null;
}

async function fromPyPI(): Promise<string | null> {
  try {
    const res = await fetch(PYPI_URL, {
      next: { revalidate: STORMLOG_META_REVALIDATE_SECONDS, tags: ["stormlog-version"] },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { info?: { version?: string } };
    return normalize(data?.info?.version);
  } catch {
    return null;
  }
}

async function fromGitHubTags(): Promise<string | null> {
  try {
    const res = await fetch(GITHUB_TAGS_URL, {
      next: { revalidate: STORMLOG_META_REVALIDATE_SECONDS, tags: ["stormlog-version"] },
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!res.ok) return null;
    const tags = (await res.json()) as Array<{ name?: string }>;
    if (!Array.isArray(tags)) return null;
    for (const tag of tags) {
      const normalized = normalize(tag?.name);
      if (normalized) return normalized;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getStormlogMeta(): Promise<StormlogMeta> {
  const pypi = await fromPyPI();
  if (pypi) return { version: pypi, source: "pypi" };

  const gh = await fromGitHubTags();
  if (gh) return { version: gh, source: "github" };

  return { version: FALLBACK_VERSION, source: "fallback" };
}
