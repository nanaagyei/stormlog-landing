"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { OPEN_SOURCE_PROOF } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { OpenSourcePeople } from "@/components/ui/open-source-people";
import { reveal, stagger } from "@/lib/motion";

const proofLinks = {
  docs: EXTERNAL_LINKS.docs,
  github: EXTERNAL_LINKS.github,
  pypi: EXTERNAL_LINKS.pypi,
  issues: EXTERNAL_LINKS.issues,
} as const;

export function MaintainersSection() {
  return (
    <SectionWrapper id="open-source">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={reveal} className="max-w-3xl">
          <span className="mono-label">Open source</span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Credibility comes from the repo, the docs, and the people
            shipping it.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stormlog&apos;s proof is the public codebase, the published package,
            the documentation footprint, and the maintainers who keep the
            project moving.
          </p>
        </motion.div>

        <motion.div variants={reveal} className="mt-10 grid gap-3 sm:grid-cols-3">
          {OPEN_SOURCE_PROOF.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={proofLinks[item.href]}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-white/6 bg-surface p-5 transition-all hover:border-white/12 hover:bg-surface-2"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-muted text-emerald">
                  <Icon className="size-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <ArrowUpRight className="size-3.5 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </a>
            );
          })}
        </motion.div>

        <motion.div
          variants={reveal}
          className="mt-10 border-t border-white/6 pt-10"
        >
          <OpenSourcePeople />
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
