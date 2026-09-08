"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Compare } from "@/components/ui/compare";
import { settle, stagger } from "@/lib/motion";

function BeforePanel() {
  return (
    <div className="h-full w-full overflow-hidden bg-deep p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-destructive" />
        <span className="font-mono text-xs uppercase tracking-wider text-destructive">
          Without Stormlog
        </span>
        <span className="ml-auto font-mono text-xs text-muted-dim">
          illustrative session
        </span>
      </div>

      <div className="mt-4 grid gap-3 font-mono text-xs leading-relaxed sm:mt-6 lg:text-sm">
        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
          <p className="break-words text-muted-foreground">$ python train.py</p>
          <p className="mt-2 text-muted-foreground">Epoch 9/50... training</p>
          <p className="text-muted-foreground">Epoch 10/50... training</p>
          <p className="mt-2 break-words text-destructive">
            RuntimeError: CUDA out of memory while allocating 2.4 GiB
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
          <p className="text-muted-foreground">$ nvidia-smi</p>
          <p className="mt-2 break-words text-muted-foreground">| 23476 MiB / 24564 MiB |</p>
          <p className="mt-2 italic text-muted-dim">
            Which tensor grew? Which step spiked?
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
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
    <div className="h-full w-full overflow-hidden bg-deep p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-emerald" />
        <span className="font-mono text-xs uppercase tracking-wider text-emerald">
          With Stormlog
        </span>
        <span className="ml-auto font-mono text-xs text-muted-dim">
          illustrative session
        </span>
      </div>

      <div className="mt-4 grid gap-3 font-mono text-xs leading-relaxed sm:mt-6 lg:text-sm">
        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
          <p className="break-words text-emerald">$ stormlog monitor --pid 12345</p>
          <p className="mt-2 text-foreground">Allocated  16.2 / 24.5 GiB</p>
          <p className="text-foreground">Peak       19.8 / 24.5 GiB</p>
          <p className="mt-2 text-emerald">✓ live alerts enabled</p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
          <p className="text-foreground">[WARN] suspicious growth detected</p>
          <p className="mt-2 text-foreground/70">signal: grad_cache +128MB</p>
          <p className="text-foreground/70">reason: repeated growth over threshold</p>
          <p className="mt-2 text-emerald">✓ export diagnostics artifact</p>
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-surface p-3 sm:p-4">
          <p className="text-foreground/80">After fixing the leak</p>
          <p className="mt-2 text-muted-foreground">batch_size = 64 ✓ stable again</p>
          <p className="break-words text-muted-foreground">peak allocated: 2.04 GiB → 0.09 GiB</p>
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
        <motion.h2
          variants={settle}
          className="font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl"
        >
          Reactive debugging vs. instrumented visibility.
        </motion.h2>
        <motion.p
          variants={settle}
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Drag the divider to compare guesswork against a workflow with live
          monitoring, anomaly signals, and exported evidence.
        </motion.p>
      </motion.div>

      <motion.div
        variants={settle}
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
