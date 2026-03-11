"use client";

import { motion } from "framer-motion";
import { CAPABILITY_GROUPS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function ProblemSection() {
  return (
    <SectionWrapper id="features">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="glass-panel overflow-hidden rounded-[36px] p-6 sm:p-8 lg:p-12"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_72%)]" />

        <motion.div variants={fadeInUp} className="relative z-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
            Why Stormlog
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-5xl">
            A product surface built around real debugging pressure.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The goal is not just to collect numbers. Stormlog helps teams see
            GPU memory as it shifts, isolate signals worth acting on, and move
            from guesswork to repeatable workflow.
          </p>
        </motion.div>

        <div className="relative z-10 mt-12 grid gap-6 xl:grid-cols-3">
          {CAPABILITY_GROUPS.map((group) => (
            <motion.div
              key={group.title}
              variants={fadeInUp}
              className="rounded-[30px] border border-white/[0.08] bg-[#09122a]/82 p-6"
            >
              <p className="text-sm font-medium text-violet">{group.eyebrow}</p>
              <h3 className="mt-4 font-heading text-2xl font-medium text-cool-white">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {group.description}
              </p>

              <div className="mt-8 space-y-5 border-t border-white/[0.06] pt-6">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="grid gap-3 border-b border-white/[0.05] pb-5 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-violet/15 bg-violet/10 text-violet">
                          <Icon className="size-4" />
                        </span>
                        <h4 className="font-heading text-lg font-medium text-cool-white">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
