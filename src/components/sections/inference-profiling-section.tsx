"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Terminal } from "lucide-react";
import { INFERENCE_SECTION } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { CopyButton } from "@/components/ui/copy-button";
import { reveal, stagger } from "@/lib/motion";

export function InferenceProfilingSection() {
  return (
    <SectionWrapper id="inference">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12"
      >
        <motion.div variants={reveal} className="min-w-0">
          <span className="mono-label break-words">
            {INFERENCE_SECTION.eyebrow}
          </span>
          <h2 className="mt-4 max-w-xl font-heading text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            {INFERENCE_SECTION.title}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:mt-4 sm:text-base lg:text-lg">
            {INFERENCE_SECTION.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
            {INFERENCE_SECTION.serverChips.map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-white/[0.06] bg-surface px-2.5 py-1 font-mono text-[11px] text-emerald sm:text-xs"
              >
                {chip}
              </span>
            ))}
          </div>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
            {INFERENCE_SECTION.highlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <li
                  key={highlight.title}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-muted text-emerald">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-foreground">
                      {highlight.title}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <a
            href={EXTERNAL_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mt-8"
          >
            Read the inference docs
            <ArrowUpRight className="size-3.5" />
          </a>
        </motion.div>

        <motion.div
          variants={reveal}
          className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/[0.06] bg-surface p-5 sm:p-6 lg:p-7"
        >
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-emerald" aria-hidden="true" />
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground/60 sm:text-[11px]">
              stormlog infer · OpenAI-compatible
            </span>
          </div>

          <CopyButton
            text={INFERENCE_SECTION.command}
            className="w-full max-w-full justify-start overflow-x-auto whitespace-nowrap px-3! py-2! text-[11px]! sm:px-4! sm:py-2.5! sm:text-xs!"
          />

          <CodeSnippet
            code={INFERENCE_SECTION.code}
            label={INFERENCE_SECTION.codeLabel}
          />
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
