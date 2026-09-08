"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessagesSquare } from "lucide-react";
import { OPEN_SOURCE_PROOF } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { OpenSourcePeople } from "@/components/ui/open-source-people";
import { settle, stagger } from "@/lib/motion";

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
        <motion.div variants={settle} className="max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            Credibility comes from the repo, the docs, and the people
            shipping it.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Stormlog&apos;s proof is the public codebase, the published package,
            the documentation footprint, and the maintainers who keep the
            project moving.
          </p>
        </motion.div>

        <motion.div variants={settle} className="mt-10 grid gap-3 sm:grid-cols-3">
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
                    <ArrowUpRight className="size-3.5 text-muted-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
          variants={settle}
          className="mt-10 border-t border-white/6 pt-10"
        >
          <OpenSourcePeople />
        </motion.div>

        <motion.div
          variants={settle}
          className="mt-10 rounded-xl border border-white/[0.06] bg-surface p-6 sm:p-8"
        >
          <h3 className="font-heading text-xl font-medium tracking-tight text-foreground">
            Questions, ideas, or a workload we should profile?
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Open a discussion on GitHub so the answer stays searchable for the
            next person with the same question. For anything that does not
            belong in public, email a maintainer directly.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={EXTERNAL_LINKS.discussions}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald px-5 text-sm font-medium text-deep transition-all hover:brightness-110"
            >
              <MessagesSquare className="size-3.5" aria-hidden="true" />
              Start a discussion
            </a>
            <a
              href={EXTERNAL_LINKS.email}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-surface px-5 text-sm font-medium text-foreground transition-all hover:border-white/[0.12] hover:bg-surface-2"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              Email a maintainer
            </a>
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
