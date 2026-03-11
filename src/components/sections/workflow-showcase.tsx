"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORKFLOW_STEPS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function WorkflowShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !trackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current!;
      const scrollDistance = track.scrollWidth - track.clientWidth;

      if (scrollDistance <= 0) return;

      return gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top+=72",
          end: () => `+=${scrollDistance + 320}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  return (
    <SectionWrapper id="workflow" wide>
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
          Workflow
        </motion.p>
        <motion.h2
          variants={fadeInUp}
          className="mt-4 font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-5xl"
        >
          Instrument, observe, diagnose, export, optimize.
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          The page story stays cinematic, but the workflow is practical:
          integrate Stormlog, watch a run live, capture useful evidence, and
          apply fixes before the next training cycle wastes more GPU time.
        </motion.p>
      </motion.div>

      <div ref={sectionRef} className="mt-12 lg:mt-16">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8"
        >
          {WORKFLOW_STEPS.map((step) => (
            <motion.article
              key={step.step}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="glass-panel relative overflow-hidden rounded-[32px] p-6 lg:min-h-[30rem] lg:min-w-[30rem] lg:max-w-[30rem] lg:p-8"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.22),transparent_70%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-full border border-violet/25 bg-violet/10 font-heading text-base font-semibold text-violet">
                    {step.step}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-cool-white/45">
                      Step {step.step}
                    </p>
                    <h3 className="mt-1 font-heading text-2xl font-medium text-cool-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-muted-foreground sm:text-base">
                  {step.description}
                </p>

                <div className="mt-8 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#040913]">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                    <div className="size-2 rounded-full bg-[#fb7185]" />
                    <div className="size-2 rounded-full bg-[#fbbf24]" />
                    <div className="size-2 rounded-full bg-[#34d399]" />
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.24em] text-cool-white/45">
                      stormlog workflow
                    </span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-cool-white/78 sm:p-5">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
