"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { Compare } from "@/components/ui/compare";
import { fadeInUp, staggerContainer } from "@/lib/motion";

function BeforePanel() {
  return (
    <div className="h-full w-full bg-[linear-gradient(180deg,#08101f_0%,#050913_100%)] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-[#fb7185]" />
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-[#fca5a5]">
          Without Stormlog
        </span>
      </div>

      <div className="mt-6 grid gap-4 font-mono text-xs sm:text-sm">
        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-[#fca5a5]">$ python train.py</p>
          <p className="mt-2 text-cool-white/65">Epoch 9/50... training</p>
          <p className="text-cool-white/65">Epoch 10/50... training</p>
          <p className="mt-3 text-[#fb7185]">
            RuntimeError: CUDA out of memory while allocating 2.4 GiB
          </p>
        </div>

        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-[#fbbf24]">$ nvidia-smi</p>
          <p className="mt-2 text-cool-white/65">| 23476 MiB / 24564 MiB |</p>
          <p className="mt-3 italic text-cool-white/45">
            Which tensor grew? Which step spiked? What changed since the last
            run?
          </p>
        </div>

        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-cool-white/75">Fallback strategy</p>
          <p className="mt-2 text-cool-white/55">batch_size = 64 → OOM</p>
          <p className="text-cool-white/55">batch_size = 32 → unstable</p>
          <p className="text-cool-white/55">batch_size = 16 → slow but survives</p>
        </div>
      </div>
    </div>
  );
}

function AfterPanel() {
  return (
    <div className="h-full w-full bg-[linear-gradient(180deg,#091228_0%,#050913_100%)] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full bg-teal" />
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-teal">
          With Stormlog
        </span>
      </div>

      <div className="mt-6 grid gap-4 font-mono text-xs sm:text-sm">
        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-violet">$ stormlog monitor --pid 12345</p>
          <p className="mt-2 text-cool-white">Allocated  16.2 / 24.5 GiB</p>
          <p className="text-cool-white">Peak       19.8 / 24.5 GiB</p>
          <p className="mt-3 text-teal">✓ live alerts enabled</p>
        </div>

        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-cyan">[WARN] suspicious growth detected</p>
          <p className="mt-2 text-cool-white/75">signal: grad_cache +128MB</p>
          <p className="text-cool-white/75">reason: repeated growth over threshold</p>
          <p className="mt-3 text-teal">✓ export diagnostics artifact</p>
        </div>

        <div className="rounded-[24px] border border-white/[0.06] bg-[#040812] p-4">
          <p className="text-cool-white/85">After the fix</p>
          <p className="mt-2 text-cool-white/65">batch_size = 96 ✓ stable</p>
          <p className="text-cool-white/65">memory saved = 2.1 GiB</p>
          <p className="text-cool-white/65">zero OOM interruptions across 50 epochs</p>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <SectionWrapper>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="text-center"
      >
        <motion.p
          variants={fadeInUp}
          className="text-sm font-medium uppercase tracking-[0.24em] text-violet"
        >
          Proof of value
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="mt-4 font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-5xl"
        >
          The difference between reactive debugging and instrumented visibility.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Stormlog is most useful when a run is already going sideways. Drag the
          divider to compare guesswork against a workflow with live monitoring,
          anomaly signals, and exported evidence.
        </motion.p>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="glass-panel mt-12 overflow-hidden rounded-[36px] p-2 sm:mt-16"
      >
        <Compare
          before={<BeforePanel />}
          after={<AfterPanel />}
          className="rounded-[32px] border border-white/[0.08]"
        />
      </motion.div>
    </SectionWrapper>
  );
}
