import test from "node:test";
import assert from "node:assert/strict";
import {
  appendRelease,
  pendingReleases,
  summarizeRelease,
  validateReleaseHistory,
} from "./release-history.mjs";

test("sync keeps intermediate releases when the published version jumps", () => {
  const releases = ["0.4.2", "0.4.1", "0.4.0"].map((version) => ({
    tag_name: `v${version}`,
    body: `Notes for ${version}`,
    published_at: "2026-10-07T00:00:00Z",
  }));
  assert.deepEqual(
    pendingReleases(releases, "0.4.0", "0.4.2").map((release) => release.tag_name),
    ["v0.4.1", "v0.4.2"]
  );
  assert.throws(() => pendingReleases(releases.slice(1), "0.4.0", "0.4.2"), /unavailable/);
});

test("archiving an outgoing reviewed summary is idempotent", () => {
  const content = {
    version: "0.4.0",
    releasedAt: "2026-10-02",
    meta: { description: "Reproducible inference workloads." },
    updates: [{ title: "Controlled arrivals", summary: "Schedule requests." }],
  };
  const entry = summarizeRelease(content);
  const once = appendRelease({ releases: [] }, entry);
  const twice = appendRelease(once, entry);
  assert.equal(twice.releases.length, 1);
  assert.equal(twice.releases[0].features[0].title, "Controlled arrivals");
  assert.equal(validateReleaseHistory(twice, "0.4.1").ok, true);
});

test("history rejects duplicate, out-of-order, and current entries", () => {
  const entry = {
    version: "0.4.0",
    releasedAt: "2026-10-02",
    summary: "Release summary",
    features: [{ title: "Feature", summary: "Feature summary" }],
    releaseUrl: "https://github.com/Silas-Asamoah/stormlog/releases/tag/v0.4.0",
  };
  assert.equal(validateReleaseHistory({ releases: [entry, entry] }, "0.4.2").ok, false);
  assert.equal(validateReleaseHistory({ releases: [entry] }, "0.4.0").ok, false);
});
