"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Github } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { FINAL_CTA, HERO_CONTENT } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { reveal, stagger } from "@/lib/motion";

export function FinalCtaSection() {
  return (
    <SectionWrapper>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative border-t border-white/6 pt-16 text-center lg:pt-20"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald/30 to-transparent" />

        <motion.span variants={reveal} className="mono-label">
          {FINAL_CTA.eyebrow}
        </motion.span>
        <motion.h2
          variants={reveal}
          className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[3.5rem] lg:leading-[1.05]"
        >
          {FINAL_CTA.title}
        </motion.h2>
        <motion.p
          variants={reveal}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {FINAL_CTA.description}
        </motion.p>

        <motion.div
          variants={reveal}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={EXTERNAL_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald px-5 text-sm font-medium text-deep transition-all hover:brightness-110"
          >
            <BookOpen className="size-3.5" />
            Read the docs
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/6 bg-surface px-5 text-sm font-medium text-foreground transition-all hover:border-white/20 hover:bg-surface-2"
          >
            <Github className="size-3.5" />
            Explore GitHub
          </a>
        </motion.div>

        <motion.div variants={reveal} className="mt-6 flex justify-center">
          <CopyButton
            text={HERO_CONTENT.installCommand}
            displayText="pip install stormlog"
          />
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
