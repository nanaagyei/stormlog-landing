"use client";

import { createContext, useContext, type ReactNode } from "react";
import { STORMLOG_VERSION as FALLBACK_VERSION } from "@/data/stormlog-version";

/**
 * Carries the runtime-resolved stormlog version from the root server layout
 * down to client components (nav badge, What's New section, dialog).
 *
 * The value is computed once per request in the root layout via
 * `getStormlogMeta()` (ISR-cached for an hour). Reading it from this context
 * — rather than importing the static `STORMLOG_VERSION` constant — means a
 * stormlog release on PyPI shows up on the landing page within an hour
 * without any rebuild.
 */
const StormlogVersionContext = createContext<string>(FALLBACK_VERSION);

export function StormlogVersionProvider({
  version,
  children,
}: {
  version: string;
  children: ReactNode;
}) {
  return (
    <StormlogVersionContext.Provider value={version}>
      {children}
    </StormlogVersionContext.Provider>
  );
}

export function useStormlogVersion(): string {
  return useContext(StormlogVersionContext);
}
