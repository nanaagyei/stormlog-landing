"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MAINTAINERS } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { useContributors } from "@/hooks/use-contributors";

const SKELETON_COUNT = 12;

function ContributorSkeletons() {
  return (
    <div className="flex flex-wrap gap-3" aria-hidden="true">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div
          key={index}
          className="size-10 animate-pulse rounded-full border border-white/6 bg-surface-2"
        />
      ))}
    </div>
  );
}

export function OpenSourcePeople() {
  const { contributors, status } = useContributors();

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
      <div>
        <span className="mono-label">Maintainers</span>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Core maintainers who set direction, review changes, and keep Stormlog
          production-ready.
        </p>

        <ul className="mt-6 space-y-3">
          {MAINTAINERS.map((maintainer) => (
            <li key={maintainer.github}>
              <a
                href={`https://github.com/${maintainer.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/6 bg-surface p-5 transition-all hover:border-white/12 hover:bg-surface-2 active:scale-[0.99]"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald/30">
                  <Image
                    src={maintainer.avatar}
                    alt={maintainer.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {maintainer.name}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-emerald">
                        {maintainer.role}
                      </p>
                      <p className="mt-1 truncate font-mono text-xs text-muted-foreground/60">
                        @{maintainer.github}
                      </p>
                    </div>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <span className="mono-label">Contributors</span>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Everyone who has shipped code to the repository, synced live from
          GitHub.
        </p>

        <div className="mt-6">
          {status === "loading" && <ContributorSkeletons />}

          {status === "error" && (
            <p className="text-sm leading-relaxed text-muted-foreground/70">
              Could not load contributors right now.{" "}
              <a
                href={`${EXTERNAL_LINKS.github}/graphs/contributors`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-emerald hover:decoration-emerald/40"
              >
                View on GitHub
              </a>
            </p>
          )}

          {status === "loaded" && contributors.length === 0 && (
            <p className="text-sm leading-relaxed text-muted-foreground/70">
              No additional contributors yet.{" "}
              <a
                href={EXTERNAL_LINKS.contributing}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-emerald hover:decoration-emerald/40"
              >
                See how to contribute
              </a>
            </p>
          )}

          {status === "loaded" && contributors.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {contributors.map((contributor) => (
                <li key={contributor.github}>
                  <a
                    href={`https://github.com/${contributor.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${contributor.name}${contributor.contributions ? ` · ${contributor.contributions} commits` : ""}`}
                    className="group block transition-opacity hover:opacity-80 active:scale-[0.98]"
                  >
                    <div className="relative size-10 overflow-hidden rounded-full border border-white/6">
                      <Image
                        src={contributor.avatar}
                        alt={contributor.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <span className="sr-only">
                      {contributor.name}
                      {contributor.contributions
                        ? `, ${contributor.contributions} commits`
                        : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
