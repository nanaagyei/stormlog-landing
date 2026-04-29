"use client";

import { motion } from "framer-motion";
import { ECOSYSTEM_BADGES } from "@/data/content";
import { reveal, stagger } from "@/lib/motion";

export function EcosystemStrip() {
  return (
    <section className="relative border-y border-white/[0.06] px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2"
      >
        <motion.span
          variants={reveal}
          className="mr-2 font-mono text-xs uppercase tracking-wider text-muted-foreground/50"
        >
          Works with
        </motion.span>
        {ECOSYSTEM_BADGES.map((badge) => (
          <motion.span
            key={badge.label}
            variants={reveal}
            className="rounded-md border border-white/[0.06] bg-surface px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            {badge.label}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
