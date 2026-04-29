"use client";

import { motion } from "framer-motion";
import { CAPABILITY_GROUPS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { reveal, stagger } from "@/lib/motion";

export function ProblemSection() {
  return (
    <SectionWrapper id="features">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={reveal} className="max-w-3xl">
          <span className="mono-label">Why Stormlog</span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            A product surface built around real debugging pressure.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            The goal is not just to collect numbers. Stormlog helps teams see
            GPU memory as it shifts, isolate signals worth acting on, and move
            from guesswork to repeatable workflow.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {CAPABILITY_GROUPS.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              variants={reveal}
              className={`rounded-xl border border-white/[0.06] bg-surface p-6 lg:p-8 ${groupIndex === CAPABILITY_GROUPS.length - 1 ? "lg:col-span-2" : ""}`}
            >
              <span className="mono-label">{group.eyebrow}</span>
              <h3 className="mt-3 font-heading text-xl font-medium tracking-tight text-foreground lg:text-2xl">
                {group.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>

              <div className={`mt-6 border-t border-white/[0.06] pt-5 ${groupIndex === CAPABILITY_GROUPS.length - 1 ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}`}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-muted text-emerald">
                        <Icon className="size-3.5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">
                          {item.title}
                        </h4>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
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
