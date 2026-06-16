// Lightweight, dependency-free validator for `src/data/updates.json`.
//
// We deliberately don't pull in ajv: this validator only has to catch the
// handful of failure modes an LLM can produce (missing keys, wrong types,
// out-of-range lengths, dodgy regex), and a 70-line custom check keeps the
// scripts directory zero-dependency.

const SEMVER_LIKE = /^\d+\.\d+\.\d+([.\-+][0-9A-Za-z.\-+]*)?$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9-]+$/;
const ALLOWED_CODE_LABELS = new Set(["python", "bash", "shell", "json", "yaml"]);

function isNonEmptyString(value, maxLength = Infinity) {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

export function validateUpdatesContent(content) {
  const errors = [];
  const push = (path, message) => errors.push(`${path}: ${message}`);

  if (!content || typeof content !== "object") {
    return { ok: false, errors: ["root: not an object"] };
  }

  if (!SEMVER_LIKE.test(content.version || "")) {
    push("version", `must match ${SEMVER_LIKE} — got ${JSON.stringify(content.version)}`);
  }
  if (!ISO_DATE.test(content.releasedAt || "")) {
    push("releasedAt", "must be YYYY-MM-DD");
  }
  if (!SLUG.test(content.whatsNewKey || "")) {
    push("whatsNewKey", "must be a lowercase slug");
  }

  const meta = content.meta;
  if (!meta || typeof meta !== "object") {
    push("meta", "must be an object");
  } else {
    if (!isNonEmptyString(meta.eyebrow, 32)) push("meta.eyebrow", "1-32 chars");
    if (!isNonEmptyString(meta.title, 72)) push("meta.title", "1-72 chars");
    if (!isNonEmptyString(meta.description, 320)) {
      push("meta.description", "1-320 chars");
    }
  }

  if (!Array.isArray(content.updates) || content.updates.length === 0) {
    push("updates", "must be a non-empty array");
    return { ok: errors.length === 0, errors };
  }
  if (content.updates.length > 4) push("updates", "max 4 items");

  const seenIds = new Set();
  content.updates.forEach((u, i) => {
    const base = `updates[${i}]`;
    if (!u || typeof u !== "object") {
      push(base, "must be an object");
      return;
    }
    if (!SLUG.test(u.id || "")) push(`${base}.id`, "lowercase slug");
    if (u.id && seenIds.has(u.id)) push(`${base}.id`, `duplicate id ${u.id}`);
    if (u.id) seenIds.add(u.id);

    if (!isNonEmptyString(u.kicker, 28)) push(`${base}.kicker`, "1-28 chars");
    if (!isNonEmptyString(u.title, 80)) push(`${base}.title`, "1-80 chars");
    if (!isNonEmptyString(u.summary, 320)) push(`${base}.summary`, "1-320 chars");

    if (!Array.isArray(u.highlights) || u.highlights.length < 2 || u.highlights.length > 6) {
      push(`${base}.highlights`, "2-6 items");
    } else {
      u.highlights.forEach((h, hi) => {
        if (!isNonEmptyString(h, 200)) {
          push(`${base}.highlights[${hi}]`, "1-200 chars");
        }
      });
    }

    if (!isNonEmptyString(u.command, 200)) push(`${base}.command`, "1-200 chars");
    if (!ALLOWED_CODE_LABELS.has(u.codeLabel)) {
      push(`${base}.codeLabel`, `one of ${[...ALLOWED_CODE_LABELS].join(", ")}`);
    }
    if (!isNonEmptyString(u.code, 800)) push(`${base}.code`, "1-800 chars");
    if (typeof u.href !== "string" || !u.href.startsWith("#")) {
      push(`${base}.href`, "must start with #");
    }
    if (u.externalLink !== undefined) {
      if (typeof u.externalLink !== "string") {
        push(`${base}.externalLink`, "must be a string");
      } else {
        try {
          new URL(u.externalLink);
        } catch {
          push(`${base}.externalLink`, "must be a valid URL");
        }
      }
    }
  });

  return { ok: errors.length === 0, errors };
}
