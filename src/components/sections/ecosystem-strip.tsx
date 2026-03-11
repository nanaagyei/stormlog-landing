"use client";

import { motion } from "framer-motion";
import {
  ECOSYSTEM_BADGES,
  ECOSYSTEM_PILLARS,
  type EcosystemBadge,
} from "@/data/content";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const badgeTones: Record<EcosystemBadge["tone"], string> = {
  framework: "border-cyan/20 bg-cyan/10 text-cyan",
  workflow: "border-violet/20 bg-violet/10 text-violet",
  export: "border-white/[0.08] bg-white/[0.04] text-cool-white/85",
};

export function EcosystemStrip() {
  return (
    <section className="relative px-4 py-14 sm:px-6 lg:px-8 lg:py-[72px]">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel overflow-hidden rounded-[32px] px-6 py-8 sm:px-8 lg:px-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <motion.div variants={fadeInUp}>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
                  Framework coverage
                </p>
                <h2 className="mt-4 max-w-3xl font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl">
                  Built for the way ML engineers actually debug memory.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Stormlog stays useful whether you start from a one-off CLI
                  session, instrument a Python training loop, or hand teammates
                  a TUI and exported artifacts for follow-up diagnosis.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 lg:justify-end"
              >
                {ECOSYSTEM_BADGES.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium",
                      badgeTones[badge.tone]
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {ECOSYSTEM_PILLARS.map((pillar) => (
                <motion.div key={pillar.title} variants={fadeInUp}>
                  <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-6">
                    <h3 className="font-heading text-xl font-medium text-cool-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
