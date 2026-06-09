"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PRODUCT_UPDATES, WHATS_NEW_META } from "@/data/updates";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { CopyButton } from "@/components/ui/copy-button";
import { reveal, stagger } from "@/lib/motion";

export function WhatsNewSection() {
  return (
    <SectionWrapper id="whats-new">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={reveal} className="max-w-2xl">
          <span className="mono-label inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5" />
            {WHATS_NEW_META.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            {WHATS_NEW_META.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {WHATS_NEW_META.description}
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {PRODUCT_UPDATES.map((update, index) => {
            const Icon = update.icon;
            return (
              <motion.article
                key={update.id}
                variants={reveal}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-surface p-6 transition-colors hover:border-emerald/30 sm:p-8"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-emerald/20 bg-emerald-muted text-emerald">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-emerald/20 bg-emerald-muted px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-emerald">
                    {update.tag}
                  </span>
                  {index === 0 && (
                    <span className="rounded-full border border-white/[0.08] bg-deep px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
                      Headline
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-heading text-xl font-semibold tracking-[-0.02em] text-foreground sm:text-2xl">
                  {update.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {update.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {update.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3">
                      <span className="mt-1.5 h-px w-4 shrink-0 bg-emerald" />
                      <span className="text-sm leading-relaxed text-muted-foreground">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-4">
                  <CopyButton
                    text={update.command}
                    className="w-full justify-start overflow-x-auto whitespace-nowrap !text-xs sm:!text-sm"
                  />
                  <CodeSnippet code={update.code} label={update.codeLabel} />
                </div>

                <div className="mt-6 pt-2">
                  <a
                    href={EXTERNAL_LINKS.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald transition-colors hover:text-foreground"
                  >
                    Read the docs
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
