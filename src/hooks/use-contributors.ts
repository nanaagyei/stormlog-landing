"use client";

import { useEffect, useState } from "react";
import { MAINTAINERS, type Person } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";

type FetchStatus = "loading" | "loaded" | "error";

interface GitHubContributor {
  login: string;
  avatar_url: string;
  type: string;
  contributions: number;
}

const CACHE_KEY = "stormlog:contributors:v1";
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
const MAX_CONTRIBUTORS = 30;

/** Pull `owner` and `repo` out of a `https://github.com/owner/repo` URL. */
function parseRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function toContributors(data: GitHubContributor[]): Person[] {
  const maintainerLogins = new Set(
    MAINTAINERS.map((maintainer) => maintainer.github.toLowerCase())
  );

  return data
    .filter((entry) => entry.type !== "Bot" && !entry.login.endsWith("[bot]"))
    .filter((entry) => !maintainerLogins.has(entry.login.toLowerCase()))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, MAX_CONTRIBUTORS)
    .map((entry) => ({
      name: entry.login,
      github: entry.login,
      avatar: entry.avatar_url,
      kind: "contributor" as const,
      contributions: entry.contributions,
    }));
}

function readCache(): Person[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: Person[] };
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return Array.isArray(parsed.data) ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeCache(data: Person[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    // Storage may be unavailable (private mode / quota) — non-fatal.
  }
}

/**
 * Fetches the repository's contributors from the public GitHub API so the
 * landing page recognises everyone who has shipped code, not just the curated
 * maintainers. Results are cached in `sessionStorage` and the hook fails
 * gracefully (empty list) when the API is unavailable or rate-limited.
 */
export function useContributors() {
  const [contributors, setContributors] = useState<Person[]>([]);
  const [status, setStatus] = useState<FetchStatus>("loading");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    // Resolved through a microtask so no setState runs synchronously inside the
    // effect body (avoids cascading renders), while still hydrating cleanly.
    Promise.resolve(readCache())
      .then((cached) => {
        if (cached) {
          if (active) {
            setContributors(cached);
            setStatus("loaded");
          }
          return null;
        }

        const repo = parseRepo(EXTERNAL_LINKS.github);
        if (!repo) throw new Error("Could not determine repository");

        return fetch(
          `https://api.github.com/repos/${repo.owner}/${repo.repo}/contributors?per_page=100`,
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`GitHub responded ${response.status}`);
            }
            return response.json() as Promise<GitHubContributor[]>;
          })
          .then((data) => toContributors(data));
      })
      .then((people) => {
        if (!people || !active) return;
        setContributors(people);
        setStatus("loaded");
        writeCache(people);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (active) setStatus("error");
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return { contributors, status };
}
