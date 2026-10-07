import historyJson from "./release-history.json";

export interface ReleaseFeature {
  title: string;
  summary: string;
}

export interface ReleaseHistoryEntry {
  version: string;
  releasedAt: string;
  summary: string;
  features: ReleaseFeature[];
  releaseUrl: string;
}

export const PREVIOUS_RELEASES = historyJson.releases as ReleaseHistoryEntry[];
