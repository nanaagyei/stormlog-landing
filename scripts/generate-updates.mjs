#!/usr/bin/env node
// Regenerate `src/data/updates.json` and archive outgoing releases.
//
// What it does:
//   1. Resolves the latest stormlog version from PyPI (with a GitHub fallback).
//   2. Pulls every GitHub release since the reviewed version.
//   3. If the current content is already on that version, exits cleanly.
//   4. Otherwise, asks an AI provider (Anthropic / Gemini / Groq, in that
//      order of preference based on which API key is set) to rewrite the
//      "What's new" content using the existing content as a voice reference.
//   5. Archives each outgoing summary, validates both files, and writes them.
// Missing release notes or an unavailable editor fail the sync instead of
// producing plausible but unverified copy.
//
// Designed to run from CI (`.github/workflows/sync-content.yml`) but also
// usable locally for one-off runs:
//
//   ANTHROPIC_API_KEY=sk-... node scripts/generate-updates.mjs
//   FORCE=1 node scripts/generate-updates.mjs          # regenerate even if version matches
//   DRY_RUN=1 node scripts/generate-updates.mjs        # print result, don't write
//
// CI integration: writes `GITHUB_OUTPUT` keys (`changed`, `version`,
// `previous_version`) so a follow-up step can decide whether to open a PR.

import { readFile, writeFile, appendFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { detectProvider, generateJson } from "./lib/ai-providers.mjs";
import { validateUpdatesContent } from "./lib/validate-updates.mjs";
import {
  appendRelease,
  pendingReleases,
  summarizeRelease,
  validateReleaseHistory,
} from "./lib/release-history.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(ROOT, "..");
const UPDATES_FILE = path.join(REPO_ROOT, "src", "data", "updates.json");
const HISTORY_FILE = path.join(REPO_ROOT, "src", "data", "release-history.json");

const PYPI_URL = "https://pypi.org/pypi/stormlog/json";
const GITHUB_RELEASES_URL =
  "https://api.github.com/repos/Silas-Asamoah/stormlog/releases";
const SEMVER_LIKE = /^\d+\.\d+\.\d+([.\-+][0-9A-Za-z.\-+]*)?$/;

function normalize(v) {
  if (typeof v !== "string") return null;
  const cleaned = v.trim().replace(/^v/, "");
  return SEMVER_LIKE.test(cleaned) ? cleaned : null;
}

async function fetchJson(url, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "stormlog-landing-content-sync",
        ...headers,
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function getLatestVersion() {
  try {
    const data = await fetchJson(PYPI_URL);
    const v = normalize(data?.info?.version);
    if (v) return { version: v, source: "pypi" };
  } catch (err) {
    console.warn(`[generate-updates] PyPI lookup failed: ${err.message}`);
  }
  // GitHub fallback
  try {
    const releases = await fetchJson(GITHUB_RELEASES_URL);
    if (Array.isArray(releases)) {
      for (const r of releases) {
        const v = normalize(r?.tag_name);
        if (v) return { version: v, source: "github" };
      }
    }
  } catch (err) {
    console.warn(`[generate-updates] GitHub lookup failed: ${err.message}`);
  }
  return null;
}

async function getReleasesSince(version) {
  const releases = [];
  for (let page = 1; page <= 10; page += 1) {
    const batch = await fetchJson(`${GITHUB_RELEASES_URL}?per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error("GitHub releases response is invalid");
    releases.push(...batch);
    if (releases.some((release) => normalize(release?.tag_name) === version)) return releases;
    if (batch.length < 100) break;
  }
  throw new Error(`could not find reviewed v${version} in GitHub release history`);
}

function whatsNewKeyFor(version, releasedAt) {
  // Convention: 'YYYY-MM-vX-Y-Z'. Fall back to today if releasedAt is unparseable.
  const parsed = new Date(releasedAt);
  const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}-v${version.replace(/\./g, "-")}`;
}

const SYSTEM_PROMPT = `You are the release-notes editor for Stormlog, an open-source GPU memory profiler for PyTorch, TensorFlow, and JAX, with OpenAI-compatible inference profiling support.

Your job: rewrite stormlog's GitHub release notes into structured marketing copy for the landing page's "What's New" section and popup.

Voice & style:
- Tight, technical, developer-first. No marketing fluff.
- Short kickers (e.g. "JAX support", "Inference profiling"). Always Title Case for major nouns.
- Summaries focus on what changed and why it matters to ML engineers.
- Highlights are concrete capabilities — APIs, CLI commands, supported devices, percentiles. Avoid vague claims.
- Match the existing tone: a senior infra engineer explaining a tool to peers.

You MUST return ONLY valid JSON matching this shape (no markdown, no commentary):

{
  "version": "<semver, e.g. 0.3.6>",
  "releasedAt": "YYYY-MM-DD",
  "whatsNewKey": "<lowercase-slug>",
  "meta": {
    "eyebrow": "Latest release",                    // 1-32 chars
    "title": "What's new in Stormlog",              // 1-72 chars
    "description": "<1-3 sentence overview>"        // 1-320 chars
  },
  "updates": [                                       // 1 to 4 items
    {
      "id": "<lowercase-slug>",
      "kicker": "<2-3 word topic>",                  // HARD LIMIT 28 chars — aim for ≤24
      "title": "<headline>",                         // 1-80 chars
      "summary": "<1-2 sentences>",                  // 1-320 chars
      "highlights": ["<bullet>", ...],               // 2-6 items, 1-200 chars each
      "command": "<primary install/CLI line>",       // 1-200 chars
      "codeLabel": "python" | "bash" | "shell" | "json" | "yaml",
      "code": "<short usage example>",               // 1-800 chars
      "href": "#whats-new",
      "externalLink": "<optional docs URL>"
    }
  ]
}

Length budgets are HARD LIMITS — exceeding them fails schema validation and breaks the build. Before returning, count characters on every "kicker" (≤28), "title" (≤80), "summary" (≤320), and "highlights[]" entry (≤200). When in doubt, shorten.

Kicker guidance:
- Aim for 2 short words (e.g. "JAX support", "Inference profiling", "Rollup summaries"). Never 4+ words.
- Drop filler words like "views", "support" if it pushes you over budget.
- If you're tempted to write 25+ characters, you can almost certainly say it in fewer.

Rules:
- Only include updates that are MAJOR or USER-FACING from the release notes. Skip pure refactors, doc-only changes, CI fixes, dependency bumps.
- If the release notes mention multiple distinct features (e.g. "JAX support" + "Inference profiling"), give each its own entry.
- If only one feature is genuinely new, return a single entry — do not pad.
- The "command" field should be the most useful one-line invocation a new user would copy. Prefer pip install lines for new packages, or the headline CLI command.
- The "code" field is a short, runnable Python or shell snippet showing the feature in use.
- If you cannot determine an externalLink with confidence, omit the field.`;

function buildUserPrompt({ version, releasedAt, releaseTitle, releaseBody, previous }) {
  const previousJson = JSON.stringify(previous, null, 2);
  return `Stormlog has just released v${version} on ${releasedAt}.

GitHub release title: ${releaseTitle || `v${version}`}

GitHub release notes (raw markdown):
"""
${(releaseBody || "(no body)").slice(0, 6000)}
"""

For voice reference, here is the CURRENT "What's New" JSON (covering the previous release v${previous?.version ?? "unknown"}). Match its register and structure — but do NOT copy its content unless the new release genuinely contains the same features:

${previousJson}

Generate the new updates.json for v${version}. Set "version" to "${version}" and "releasedAt" to "${releasedAt}". Choose a whatsNewKey that follows the YYYY-MM-vX-Y-Z convention.

Return ONLY the JSON object.`;
}

async function emitOutput(key, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (!file) return;
  await appendFile(file, `${key}=${value}\n`);
}

async function main() {
  const force = process.env.FORCE === "1" || process.env.FORCE === "true";
  const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

  const previousRaw = await readFile(UPDATES_FILE, "utf8");
  const previous = JSON.parse(previousRaw);
  const history = JSON.parse(await readFile(HISTORY_FILE, "utf8"));
  const currentHistoryCheck = validateReleaseHistory(history, previous.version);
  if (!currentHistoryCheck.ok) {
    throw new Error(`release history invalid: ${currentHistoryCheck.errors.join("; ")}`);
  }

  const latest = await getLatestVersion();
  if (!latest) {
    throw new Error("could not resolve latest published version");
  }

  await emitOutput("version", latest.version);
  await emitOutput("previous_version", previous.version);
  await emitOutput("release_url", `https://github.com/Silas-Asamoah/stormlog/releases/tag/v${latest.version}`);

  if (!force && latest.version === previous.version) {
    console.log(
      `[generate-updates] already on v${latest.version} (source: ${latest.source}); nothing to do`
    );
    await emitOutput("changed", "false");
    await emitOutput("provider", "not-run");
    return;
  }

  console.log(
    `[generate-updates] new version detected: v${previous.version} -> v${latest.version}`
  );

  const provider = detectProvider(process.env);
  if (!provider) {
    throw new Error("no AI provider configured for release-note generation");
  }
  const releases = await getReleasesSince(previous.version);
  const pending = pendingReleases(releases, previous.version, latest.version);
  const queue = pending.length > 0
    ? pending
    : releases.filter((release) => normalize(release.tag_name) === latest.version);
  if (queue.length === 0) throw new Error(`verified release notes for v${latest.version} are unavailable`);

  let next = previous;
  let nextHistory = history;
  let providerUsed = provider.name;

  console.log(`[generate-updates] using provider: ${provider.name} (${provider.model})`);
  for (const release of queue) {
    const version = normalize(release.tag_name);
    if (!release.body?.trim() || !release.published_at || !version) {
      throw new Error(`verified release notes for v${version || latest.version} are unavailable`);
    }
    const releasedAt = release.published_at.slice(0, 10);
    const pinMeta = (obj) => {
      if (!obj || typeof obj !== "object") return obj;
      obj.version = version;
      obj.releasedAt = releasedAt;
      obj.whatsNewKey = whatsNewKeyFor(version, releasedAt);
      return obj;
    };
    const userPrompt = buildUserPrompt({
      version,
      releasedAt,
      releaseTitle: release.name,
      releaseBody: release.body,
      previous: next,
    });
    let generated;
    try {
      generated = pinMeta(
        await generateJson({ provider, systemPrompt: SYSTEM_PROMPT, userPrompt })
      );

      // Validate; if the model produced something out of bounds, give it one
      // chance to fix itself before failing the sync.
      let check = validateUpdatesContent(generated);
      if (!check.ok) {
        console.warn(
          "[generate-updates] first attempt failed validation, retrying with feedback:"
        );
        for (const e of check.errors) console.warn(`  - ${e}`);
        const repairPrompt = `${userPrompt}\n\nYour previous response failed schema validation with these errors:\n\n${check.errors.map((e) => `- ${e}`).join("\n")}\n\nPrevious response:\n${JSON.stringify(generated, null, 2)}\n\nReturn a corrected JSON object that fixes EVERY error above. Pay special attention to character-count limits — count carefully. Return ONLY the JSON object.`;
        generated = pinMeta(
          await generateJson({
            provider,
            systemPrompt: SYSTEM_PROMPT,
            userPrompt: repairPrompt,
          })
        );
        check = validateUpdatesContent(generated);
        if (!check.ok) {
          throw new Error(
            `validation still failing after retry: ${check.errors.join("; ")}`
          );
        }
        providerUsed = `${provider.name}+repair`;
      }
    } catch (err) {
      throw new Error(`release-note generation failed for v${version}: ${err.message}`, { cause: err });
    }
    if (version !== next.version) nextHistory = appendRelease(nextHistory, summarizeRelease(next));
    next = generated;
  }

  // Fail loudly if content is invalid rather than proposing it for review.
  const { ok, errors } = validateUpdatesContent(next);
  if (!ok) {
    console.error("[generate-updates] final content failed validation:");
    for (const e of errors) console.error(`  - ${e}`);
    console.error("\n--- generated ---");
    console.error(JSON.stringify(next, null, 2));
    process.exit(1);
  }
  const historyCheck = validateReleaseHistory(nextHistory, next.version);
  if (!historyCheck.ok) {
    throw new Error(`release history invalid: ${historyCheck.errors.join("; ")}`);
  }

  // Preserve our $schema reference for editor tooling.
  const payload = {
    $schema: previous.$schema || "./updates.schema.json",
    ...next,
  };

  if (dryRun) {
    console.log("[generate-updates] DRY_RUN — would write:");
    console.log(JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(nextHistory, null, 2));
    await emitOutput("changed", "true");
    await emitOutput("provider", providerUsed);
    return;
  }

  await writeFile(UPDATES_FILE, JSON.stringify(payload, null, 2) + "\n");
  await writeFile(HISTORY_FILE, JSON.stringify(nextHistory, null, 2) + "\n");
  console.log(
    `[generate-updates] wrote ${path.relative(REPO_ROOT, UPDATES_FILE)} (v${latest.version}, provider: ${providerUsed})`
  );
  await emitOutput("changed", "true");
  await emitOutput("provider", providerUsed);
}

main().catch((err) => {
  console.error(`[generate-updates] fatal: ${err.stack || err.message || err}`);
  process.exit(1);
});
