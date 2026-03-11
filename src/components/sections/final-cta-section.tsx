"use client";

import { ArrowRight, BookOpen, Github } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { FINAL_CTA, HERO_CONTENT } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { SectionWrapper } from "@/components/ui/section-wrapper";

export function FinalCtaSection() {
  return (
    <SectionWrapper>
      <div className="glass-panel relative overflow-hidden rounded-[40px] px-6 py-12 text-center sm:px-10 lg:px-16 lg:py-[72px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.3),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-70 noise-overlay" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
            {FINAL_CTA.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-cool-white sm:text-5xl lg:text-[4.25rem] lg:leading-[1.02]">
            {FINAL_CTA.title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {FINAL_CTA.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#120d2a] transition-all hover:translate-y-[-1px]"
            >
              <BookOpen className="size-4" />
              Read the docs
              <ArrowRight className="size-4" />
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium text-cool-white transition-all hover:border-violet/35 hover:bg-white/[0.04]"
            >
              <Github className="size-4" />
              Explore GitHub
            </a>
          </div>

          <div className="mt-5 flex justify-center">
            <CopyButton
              text={HERO_CONTENT.installCommand}
              displayText="pip install stormlog"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
