"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Compare } from "@/components/ui/compare";
import { reveal, stagger } from "@/lib/motion";

function BeforePanel() {
  return (
    <div className="h-full w-full bg-deep p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-red-400" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-red-400">
          Without Stormlog
        </span>
      </div>

      <div className="mt-6 grid gap-3 font-mono text-xs sm:text-sm">
        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-red-300">$ python train.py</p>
          <p className="mt-2 text-muted-foreground">Epoch 9/50... training</p>
          <p className="text-muted-foreground">Epoch 10/50... training</p>
          <p className="mt-2 text-red-400">
            RuntimeError: CUDA out of memory while allocating 2.4 GiB
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-yellow-400">$ nvidia-smi</p>
          <p className="mt-2 text-muted-foreground">| 23476 MiB / 24564 MiB |</p>
          <p className="mt-2 italic text-muted-foreground/60">
            Which tensor grew? Which step spiked?
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-foreground/70">Fallback strategy</p>
          <p className="mt-2 text-muted-foreground">batch_size = 64 → OOM</p>
          <p className="text-muted-foreground">batch_size = 32 → unstable</p>
          <p className="text-muted-foreground">batch_size = 16 → slow but survives</p>
        </div>
      </div>
    </div>
  );
}

function AfterPanel() {
  return (
    <div className="h-full w-full bg-deep p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-emerald" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald">
          With Stormlog
        </span>
      </div>

      <div className="mt-6 grid gap-3 font-mono text-xs sm:text-sm">
        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-emerald">$ stormlog monitor --pid 12345</p>
          <p className="mt-2 text-foreground">Allocated  16.2 / 24.5 GiB</p>
          <p className="text-foreground">Peak       19.8 / 24.5 GiB</p>
          <p className="mt-2 text-emerald">✓ live alerts enabled</p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-yellow-400">[WARN] suspicious growth detected</p>
          <p className="mt-2 text-foreground/70">signal: grad_cache +128MB</p>
          <p className="text-foreground/70">reason: repeated growth over threshold</p>
          <p className="mt-2 text-emerald">✓ export diagnostics artifact</p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-4">
          <p className="text-foreground/80">After fixing the leak</p>
          <p className="mt-2 text-muted-foreground">batch_size = 64 ✓ stable again</p>
          <p className="text-muted-foreground">peak allocated: 2.04 GB → 0.09 GB</p>
          <p className="text-muted-foreground">zero OOM interruptions across 50 epochs</p>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <SectionWrapper>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="text-center"
      >
        <motion.span variants={reveal} className="mono-label">
          Proof of value
        </motion.span>
        <motion.h2
          variants={reveal}
          className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl"
        >
          Reactive debugging vs. instrumented visibility.
        </motion.h2>
        <motion.p
          variants={reveal}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Drag the divider to compare guesswork against a workflow with live
          monitoring, anomaly signals, and exported evidence.
        </motion.p>
      </motion.div>

      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-12 sm:mt-16"
      >
        <Compare
          before={<BeforePanel />}
          after={<AfterPanel />}
          className="rounded-xl border border-white/[0.06]"
        />
      </motion.div>
    </SectionWrapper>
  );
}
