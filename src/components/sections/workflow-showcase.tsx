"use client";

import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WORKFLOW_STEPS, type WorkflowStep } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const workflowTones = [
  {
    badge: "border-violet/25 bg-violet/10 text-violet",
    glow:
      "bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.26),transparent_72%)]",
    line: "from-violet/70 via-violet/20 to-transparent",
  },
  {
    badge: "border-cyan/25 bg-cyan/10 text-cyan",
    glow:
      "bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.22),transparent_72%)]",
    line: "from-cyan/70 via-cyan/20 to-transparent",
  },
  {
    badge: "border-teal/25 bg-teal/10 text-teal",
    glow:
      "bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.2),transparent_72%)]",
    line: "from-teal/70 via-teal/20 to-transparent",
  },
] as const;

interface WorkflowCardProps {
  step: WorkflowStep;
  compact?: boolean;
  inert?: boolean;
  className?: string;
}

function WorkflowCard({
  step,
  compact = false,
  inert = false,
  className,
}: WorkflowCardProps) {
  const tone = workflowTones[(step.step - 1) % workflowTones.length];

  return (
    <article
      aria-hidden={inert || undefined}
      tabIndex={inert ? -1 : 0}
      className={cn(
        "workflow-card glass-panel group relative flex h-full flex-col overflow-hidden rounded-[32px] border-white/[0.08] bg-[#07101f]/94 outline-none transition-all duration-300 motion-safe:hover:-translate-y-1.5 motion-safe:focus-visible:-translate-y-1.5 hover:border-violet/20 hover:shadow-[0_30px_120px_rgba(1,3,10,0.68),inset_0_1px_0_rgba(255,255,255,0.08)] focus-visible:border-violet/30 focus-visible:shadow-[0_30px_120px_rgba(1,3,10,0.68),inset_0_1px_0_rgba(255,255,255,0.08)]",
        compact
          ? "min-h-[28rem] w-full p-5 sm:min-h-[29rem] sm:p-6"
          : "min-h-[31rem] w-[26rem] p-7 xl:w-[28rem]",
        className
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 opacity-90", tone.glow)} />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r",
          tone.line
        )}
      />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_34%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-full border font-heading text-base font-semibold",
                tone.badge
              )}
            >
              {step.step}
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cool-white/45">
                Step {step.step}
              </p>
              <h3 className="mt-2 font-heading text-2xl font-medium text-cool-white">
                {step.title}
              </h3>
            </div>
          </div>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cool-white/45">
            Stormlog
          </span>
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
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 whitespace-pre-wrap text-cool-white/78 sm:p-5">
            <code>{step.code}</code>
          </pre>
        </div>
      </div>
    </article>
  );
}

export function WorkflowShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [desktopPaused, setDesktopPaused] = useState(false);
  const [mobilePaused, setMobilePaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const advanceStep = useEffectEvent(() => {
    startTransition(() => {
      setActiveIndex((index) => (index + 1) % WORKFLOW_STEPS.length);
    });
  });

  useEffect(() => {
    if (reducedMotion || mobilePaused) return;

    const intervalId = window.setInterval(advanceStep, 4200);
    return () => window.clearInterval(intervalId);
  }, [mobilePaused, reducedMotion]);

  const activeStep = WORKFLOW_STEPS[activeIndex];

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

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-12 lg:hidden"
      >
        <div
          className="glass-panel rounded-[32px] p-4 sm:p-5"
          onMouseEnter={() => setMobilePaused(true)}
          onMouseLeave={() => setMobilePaused(false)}
          onFocusCapture={() => setMobilePaused(true)}
          onBlurCapture={({ currentTarget, relatedTarget }) => {
            if (!currentTarget.contains(relatedTarget as Node | null)) {
              setMobilePaused(false);
            }
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cool-white/45">
                Featured step
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                One card at a time so the workflow stays readable on smaller
                screens.
              </p>
            </div>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cool-white/55">
              {reducedMotion ? "Manual" : mobilePaused ? "Paused" : "Auto"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.step}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -18 }}
              transition={{ duration: reducedMotion ? 0 : 0.35 }}
              className="mt-6"
            >
              <WorkflowCard step={activeStep} compact />
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {WORKFLOW_STEPS.map((step, index) => (
              <button
                key={step.step}
                onClick={() => {
                  setMobilePaused(true);
                  setActiveIndex(index);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-sm transition-all",
                  index === activeIndex
                    ? "border-violet/30 bg-violet/10 text-cool-white"
                    : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-cool-white"
                )}
                aria-label={`Show workflow step ${step.step}: ${step.title}`}
              >
                {step.step.toString().padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-12 hidden lg:block lg:mt-16"
      >
        {reducedMotion ? (
          <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {WORKFLOW_STEPS.map((step) => (
              <WorkflowCard key={step.step} step={step} />
            ))}
          </div>
        ) : (
          <div
            className="workflow-loop relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#040913]/60 p-5 lg:p-6"
            onMouseEnter={() => setDesktopPaused(true)}
            onMouseLeave={() => setDesktopPaused(false)}
            onFocusCapture={() => setDesktopPaused(true)}
            onBlurCapture={({ currentTarget, relatedTarget }) => {
              if (!currentTarget.contains(relatedTarget as Node | null)) {
                setDesktopPaused(false);
              }
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#040913] via-[#040913]/88 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#040913] via-[#040913]/88 to-transparent" />
            <div className="pointer-events-none absolute inset-0 opacity-35 grid-bg" />

            <div
              className="workflow-loop-track animate-marquee relative flex w-max"
              style={{
                animationDuration: "32s",
                animationPlayState: desktopPaused ? "paused" : "running",
                willChange: "transform",
              }}
            >
              {Array.from({ length: 2 }).map((_, repeatIndex) => (
                <div
                  key={repeatIndex}
                  aria-hidden={repeatIndex === 1}
                  className="flex shrink-0 gap-6 pr-6 xl:gap-8 xl:pr-8"
                >
                  {WORKFLOW_STEPS.map((step) => (
                    <WorkflowCard
                      key={`${repeatIndex}-${step.step}`}
                      step={step}
                      inert={repeatIndex === 1}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </SectionWrapper>
  );
}
