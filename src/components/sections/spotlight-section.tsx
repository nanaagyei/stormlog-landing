"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SPOTLIGHT_CONTENT } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { reveal, stagger } from "@/lib/motion";

export function SpotlightSection() {
  return (
    <SectionWrapper>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
      >
        <motion.div variants={reveal}>
          <span className="mono-label">{SPOTLIGHT_CONTENT.eyebrow}</span>
          <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            {SPOTLIGHT_CONTENT.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {SPOTLIGHT_CONTENT.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {SPOTLIGHT_CONTENT.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-white/[0.06] bg-surface px-2.5 py-1 font-mono text-xs text-emerald"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {SPOTLIGHT_CONTENT.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <span className="mt-1.5 h-px w-4 shrink-0 bg-emerald" />
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={reveal}>
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-deep">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
                Diagnostics workspace
              </span>
            </div>
            <div className="relative aspect-[1411/859]">
              <Image
                src={SPOTLIGHT_CONTENT.image}
                alt="Stormlog diagnostics view"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-deep to-transparent" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
