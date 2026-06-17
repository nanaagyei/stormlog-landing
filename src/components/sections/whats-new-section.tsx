"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";
import {
  PRODUCT_UPDATES,
  WHATS_NEW_META,
  WHATS_NEW_RELEASED_AT,
} from "@/data/updates";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { CopyButton } from "@/components/ui/copy-button";
import { useStormlogVersion } from "@/components/providers/stormlog-version-provider";
import { reveal, stagger } from "@/lib/motion";

function formatReleaseDate(iso: string): string | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function WhatsNewSection() {
  const stormlogVersion = useStormlogVersion();
  const releasedAt = formatReleaseDate(WHATS_NEW_RELEASED_AT);

  return (
    <SectionWrapper id="whats-new">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={reveal} className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="mono-label break-words">
              {WHATS_NEW_META.eyebrow} · v{stormlogVersion}
            </span>
            {releasedAt && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60">
                <Calendar className="size-3" aria-hidden="true" />
                {releasedAt}
              </span>
            )}
          </div>
          <h2 className="mt-4 font-heading text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            {WHATS_NEW_META.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            {WHATS_NEW_META.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:mt-6 sm:gap-x-5">
            <a
              href={EXTERNAL_LINKS.releases}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              View all releases
              <ArrowUpRight className="size-3.5" />
            </a>
            <span aria-hidden="true" className="hidden h-3 w-px bg-white/[0.08] sm:inline" />
            <a
              href={EXTERNAL_LINKS.pypi}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              Read on PyPI
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5">
          {PRODUCT_UPDATES.map((update) => (
            <motion.article
              key={update.id}
              variants={reveal}
              className="group/card relative flex min-w-0 flex-col rounded-xl border border-white/[0.06] bg-surface p-5 transition-colors hover:border-white/[0.12] sm:p-6 lg:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 sm:inset-x-6"
              />
              <span className="mono-label break-words">{update.kicker}</span>
              <h3 className="mt-3 font-heading text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl lg:text-2xl">
                {update.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {update.summary}
              </p>

              <ul className="mt-5 space-y-3 border-t border-white/[0.06] pt-5 sm:mt-6">
                {update.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-px w-3.5 shrink-0 bg-emerald"
                    />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex min-w-0 flex-col gap-3 sm:mt-6">
                <CopyButton
                  text={update.command}
                  className="w-full max-w-full justify-start overflow-x-auto whitespace-nowrap px-3! py-2! text-[11px]! sm:px-4! sm:py-2.5! sm:text-xs!"
                />
                <CodeSnippet code={update.code} label={update.codeLabel} />
              </div>

              <a
                href={update.externalLink || EXTERNAL_LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mt-6"
              >
                Read the docs
                <ArrowUpRight className="size-3.5 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
              </a>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
