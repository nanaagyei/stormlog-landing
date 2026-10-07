const STABLE_VERSION = /^\d+\.\d+\.\d+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function compareVersions(left, right) {
  if (!STABLE_VERSION.test(left) || !STABLE_VERSION.test(right)) {
    throw new Error(`stable versions required: ${left}, ${right}`);
  }
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

export function pendingReleases(releases, currentVersion, targetVersion) {
  if (compareVersions(currentVersion, targetVersion) > 0) {
    throw new Error(`published version ${targetVersion} is older than reviewed ${currentVersion}`);
  }
  const selected = releases
    .filter((release) => {
      const version = release.tag_name?.replace(/^v/, "");
      return STABLE_VERSION.test(version || "") &&
        compareVersions(version, currentVersion) > 0 &&
        compareVersions(version, targetVersion) <= 0 &&
        !release.draft && !release.prerelease;
    })
    .sort((a, b) => compareVersions(a.tag_name.replace(/^v/, ""), b.tag_name.replace(/^v/, "")));

  if (compareVersions(currentVersion, targetVersion) < 0 &&
      selected.at(-1)?.tag_name?.replace(/^v/, "") !== targetVersion) {
    throw new Error(`GitHub release for published v${targetVersion} is unavailable`);
  }
  return selected;
}

export function summarizeRelease(content) {
  return {
    version: content.version,
    releasedAt: content.releasedAt,
    summary: content.meta.description,
    features: content.updates.map(({ title, summary }) => ({ title, summary })),
    releaseUrl: `https://github.com/Silas-Asamoah/stormlog/releases/tag/v${content.version}`,
  };
}

export function appendRelease(history, entry) {
  const releases = history.releases;
  if (releases.some((release) => release.version === entry.version)) return history;
  return { ...history, releases: [...releases, entry] };
}

export function validateReleaseHistory(history, currentVersion) {
  const errors = [];
  if (!history || !Array.isArray(history.releases)) {
    return { ok: false, errors: ["releases must be an array"] };
  }
  let previousVersion = null;
  history.releases.forEach((release, index) => {
    const path = `releases[${index}]`;
    if (!release || !STABLE_VERSION.test(release.version || "")) {
      errors.push(`${path}.version must be a stable version`);
      return;
    }
    if (previousVersion && compareVersions(previousVersion, release.version) >= 0) {
      errors.push(`${path}.version must be later than the previous entry`);
    }
    if (compareVersions(release.version, currentVersion) >= 0) {
      errors.push(`${path}.version must be older than current v${currentVersion}`);
    }
    previousVersion = release.version;
    if (!ISO_DATE.test(release.releasedAt || "")) errors.push(`${path}.releasedAt must be YYYY-MM-DD`);
    if (typeof release.summary !== "string" || !release.summary.trim() || release.summary.length > 320) {
      errors.push(`${path}.summary must be 1-320 characters`);
    }
    if (!Array.isArray(release.features) || release.features.length < 1 || release.features.length > 4) {
      errors.push(`${path}.features must contain 1-4 entries`);
    } else {
      release.features.forEach((feature, featureIndex) => {
        if (!feature || typeof feature.title !== "string" || !feature.title.trim() || feature.title.length > 80 ||
            typeof feature.summary !== "string" || !feature.summary.trim() || feature.summary.length > 320) {
          errors.push(`${path}.features[${featureIndex}] requires a title and summary`);
        }
      });
    }
    try {
      const url = new URL(release.releaseUrl);
      if (url.protocol !== "https:" || url.hostname !== "github.com") throw new Error("invalid host");
    } catch {
      errors.push(`${path}.releaseUrl must be a GitHub HTTPS URL`);
    }
  });
  return { ok: errors.length === 0, errors };
}
