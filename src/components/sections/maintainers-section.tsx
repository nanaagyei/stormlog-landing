"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MAINTAINERS, OPEN_SOURCE_PROOF } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";

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
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeInUp}>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
            Open source proof
          </p>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-[3.2rem] lg:leading-[1.04]">
            Credibility comes from the repo, the docs, and the people shipping
            it.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            This landing page is intentionally not padded with generic
            testimonials. Stormlog’s proof is the public codebase, the
            published package, the documentation footprint, and the maintainers
            who keep the project moving.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {OPEN_SOURCE_PROOF.map((item) => {
            const Icon = item.icon;

            return (
              <motion.a
                key={item.title}
                variants={fadeInUp}
                href={proofLinks[item.href]}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel group rounded-[28px] p-5 transition-all hover:border-violet/30 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-violet/15 bg-violet/10 text-violet">
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRight className="size-4 text-cool-white/45 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-[-1px]" />
                </div>
                <h3 className="mt-6 font-heading text-xl font-medium text-cool-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="mt-12 grid gap-6 sm:grid-cols-3 sm:mt-16"
      >
        {MAINTAINERS.map((maintainer) => (
          <motion.div key={maintainer.github} variants={fadeInUp}>
            <div className="glass-panel rounded-[30px] p-6 text-center transition-all hover:border-violet/25 hover:bg-white/[0.04]">
              <div className="relative mx-auto size-20 overflow-hidden rounded-full border border-white/[0.1]">
                <Image
                  src={maintainer.avatar}
                  alt={maintainer.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <h3 className="mt-5 font-heading text-xl font-medium text-cool-white">
                {maintainer.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{maintainer.role}</p>
              <a
                href={`https://github.com/${maintainer.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-sm text-cool-white/85 transition-all hover:border-violet/30 hover:text-white"
              >
                @{maintainer.github}
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
