"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PRODUCT_UPDATES, WHATS_NEW_META } from "@/data/updates";
import { EXTERNAL_LINKS, STORMLOG_VERSION } from "@/data/navigation";
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
          <span className="mono-label">
            {WHATS_NEW_META.eyebrow} · v{STORMLOG_VERSION}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            {WHATS_NEW_META.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {WHATS_NEW_META.description}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {PRODUCT_UPDATES.map((update) => (
            <motion.article
              key={update.id}
              variants={reveal}
              className="flex flex-col rounded-xl border border-white/6 bg-surface p-6 lg:p-8"
            >
              <span className="mono-label">{update.kicker}</span>
              <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-foreground lg:text-2xl">
                {update.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {update.summary}
              </p>

              <ul className="mt-6 space-y-3 border-t border-white/6 pt-5">
                {update.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-1.5 h-px w-3.5 shrink-0 bg-emerald" />
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <CopyButton
                  text={update.command}
                  className="w-full justify-start overflow-x-auto whitespace-nowrap text-xs! sm:text-sm!"
                />
                <CodeSnippet code={update.code} label={update.codeLabel} />
              </div>

              <a
                href={update.externalLink || EXTERNAL_LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {update.externalLink ? "Read the docs" : "Read the docs"}
                <ArrowUpRight className="size-3.5" />
              </a>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
