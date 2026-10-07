"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PREVIOUS_RELEASES } from "@/data/release-history";
import { PRODUCT_UPDATES, WHATS_NEW_CONTENT_VERSION, WHATS_NEW_META } from "@/data/updates";
import { cn } from "@/lib/utils";

const releases = [...PREVIOUS_RELEASES].reverse();

export function ReleaseComparison() {
  const [selectedVersion, setSelectedVersion] = useState(releases[0]?.version);
  const selected = releases.find((release) => release.version === selectedVersion);

  if (!selected) {
    return <p className="text-sm text-muted-foreground">Previous release summaries are not available yet.</p>;
  }

  return (
    <div>
      <div className="border-b border-white/[0.06] pb-5">
        <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-foreground">
          Previous release features
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Choose a release to compare its highlights with the current notes.
        </p>
        <div className="mt-4 flex max-h-24 flex-wrap gap-2 overflow-y-auto" aria-label="Choose a previous release">
          {releases.map((release) => (
            <button
              key={release.version}
              type="button"
              onClick={() => setSelectedVersion(release.version)}
              aria-pressed={release.version === selectedVersion}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60",
                release.version === selectedVersion
                  ? "border-emerald/50 bg-emerald/10 text-emerald"
                  : "border-white/[0.08] text-muted-foreground hover:border-white/[0.18] hover:text-foreground"
              )}
            >
              v{release.version}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 pt-5 md:grid-cols-2 md:gap-8">
        <section aria-labelledby="current-release-heading">
          <h4 id="current-release-heading" className="font-heading text-lg font-semibold text-foreground">
            Current notes <span className="font-mono text-sm font-normal text-emerald">v{WHATS_NEW_CONTENT_VERSION}</span>
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{WHATS_NEW_META.description}</p>
          <ul className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
            {PRODUCT_UPDATES.map((feature) => (
              <li key={feature.id}>
                <p className="text-sm font-medium text-foreground">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.summary}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="previous-release-heading" className="border-t border-white/[0.06] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
          <h4 id="previous-release-heading" className="font-heading text-lg font-semibold text-foreground">
            Previous <span className="font-mono text-sm font-normal text-muted-dim">v{selected.version}</span>
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selected.summary}</p>
          <ul className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
            {selected.features.map((feature) => (
              <li key={feature.title}>
                <p className="text-sm font-medium text-foreground">{feature.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{feature.summary}</p>
              </li>
            ))}
          </ul>
          <a
            href={selected.releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-emerald underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald/60"
          >
            View v{selected.version} release notes <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </section>
      </div>
    </div>
  );
}
