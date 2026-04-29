"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WORKFLOW_STEPS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function WorkflowShowcase() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !timelineRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <SectionWrapper id="workflow">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mono-label">Workflow</span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
          Instrument, observe, diagnose, export, optimize.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Integrate Stormlog, watch a run live, capture useful evidence, and
          apply fixes before the next training cycle wastes more GPU time.
        </p>
      </div>

      <div ref={timelineRef} className="relative mt-14 lg:mt-20">
        <div className="absolute top-0 bottom-0 left-6 w-px bg-white/[0.06] lg:left-[3.5rem]" />

        <div className="space-y-12 lg:space-y-16">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              data-step
              className="relative grid gap-4 pl-14 lg:grid-cols-[1fr_1.2fr] lg:gap-8 lg:pl-24"
            >
              <div className="absolute left-3 top-0 flex size-7 items-center justify-center rounded-md bg-surface border border-white/[0.06] font-mono text-xs font-semibold text-emerald lg:left-10 lg:size-9 lg:text-sm">
                {step.step.toString().padStart(2, "0")}
              </div>

              <div>
                <h3 className="font-heading text-xl font-medium tracking-tight text-foreground lg:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.description}
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-deep">
                <div className="flex items-center border-b border-white/[0.06] px-4 py-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/40">
                    step {step.step.toString().padStart(2, "0")}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 whitespace-pre-wrap text-muted-foreground sm:text-sm">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
