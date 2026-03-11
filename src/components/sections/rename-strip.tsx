"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

export function RenameStrip() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="relative overflow-hidden border-y border-white/[0.04] bg-elevated/40 py-4 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/[0.03] to-transparent" />
      <p className="relative text-sm text-muted-foreground">
        Formerly <span className="text-cool-white/80">GPU Memory Profiler</span>.
        The next release ships as{" "}
        <span className="font-medium text-cyan">Stormlog</span>.
      </p>
    </motion.div>
  );
}
