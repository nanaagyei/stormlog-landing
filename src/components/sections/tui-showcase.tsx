"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { TUI_GALLERY_ITEMS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { reveal, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const AUTOPLAY_INTERVAL = 10_000;

export function TuiShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const activeItem = TUI_GALLERY_ITEMS[activeIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TUI_GALLERY_ITEMS.length);
    }, AUTOPLAY_INTERVAL);
  }, [clearTimer]);

  useEffect(() => {
    if (paused || reducedMotion) {
      clearTimer();
      return;
    }
    startTimer();
    return clearTimer;
  }, [paused, reducedMotion, startTimer, clearTimer, activeIndex]);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (!paused) startTimer();
    },
    [paused, startTimer]
  );

  return (
    <SectionWrapper id="tui">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div variants={reveal} className="max-w-3xl">
          <span className="mono-label">TUI showcase</span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl lg:text-5xl">
            A terminal-native workspace that still feels like a product.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Monitoring controls, visualization exports, diagnostics, and
            CLI-driven actions in a single interface.
          </p>
        </motion.div>

        <motion.div variants={reveal} className="mt-8">
          <div className="flex flex-wrap gap-1.5">
            {TUI_GALLERY_ITEMS.map((item, index) => (
              <button
                key={item.title}
                onClick={() => handleSelect(index)}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-mono text-xs transition-all overflow-hidden",
                  index === activeIndex
                    ? "bg-emerald-muted text-emerald border border-emerald/20"
                    : "border border-white/6 bg-surface text-muted-foreground hover:text-foreground"
                )}
              >
                {index === activeIndex && !paused && !reducedMotion && (
                  <motion.span
                    ref={progressRef}
                    key={`progress-${activeIndex}`}
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-emerald/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: "linear" }}
                  />
                )}
                <span className="relative">{item.title}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={reveal}
          className="mt-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <div className="overflow-hidden rounded-xl border border-white/6 bg-deep">
            <div className="flex items-center justify-between border-b border-white/20 px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald/70">
                {activeItem.tag}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/40">
                {activeItem.title}
              </span>
            </div>

            <div className="relative aspect-16/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeItem.image}
                    alt={activeItem.title}
                    fill
                    className="object-cover object-[center_75%]"
                    sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 960px, 100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr]">
            <h3 className="font-heading text-lg font-medium text-foreground">
              {activeItem.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeItem.description}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
