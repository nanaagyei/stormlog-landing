"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SPOTLIGHT_CONTENT } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function SpotlightSection() {
  return (
    <SectionWrapper>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="glass-panel overflow-hidden rounded-[36px] p-6 sm:p-8 lg:p-10"
      >
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <motion.div variants={fadeInUp} className="relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
              {SPOTLIGHT_CONTENT.eyebrow}
            </p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-[3.4rem] lg:leading-[1.02]">
              {SPOTLIGHT_CONTENT.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {SPOTLIGHT_CONTENT.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {SPOTLIGHT_CONTENT.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-violet/20 bg-violet/10 px-4 py-2 text-sm text-cool-white"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              {SPOTLIGHT_CONTENT.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-teal" />
                  <p className="text-sm leading-7 text-cool-white/82 sm:text-base">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="relative">
            <div className="absolute inset-0 violet-halo scale-110 blur-3xl" />
            <div className="glass-panel relative overflow-hidden rounded-[32px] p-3">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.25),transparent_70%)]" />
              <div className="relative aspect-[1411/859] overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#040812]">
                <Image
                  src={SPOTLIGHT_CONTENT.image}
                  alt="Stormlog diagnostics view"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 52vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040812] via-transparent to-transparent opacity-70" />
                <div className="absolute top-5 left-5 rounded-full border border-white/[0.1] bg-[#0c1431]/80 px-3 py-1.5 text-xs font-medium tracking-[0.24em] text-cool-white/80 uppercase">
                  Diagnostics workspace
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
