"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { TUI_GALLERY_ITEMS } from "@/data/content";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const stackLayouts = [
  {
    className: "z-40",
    style: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  },
  {
    className: "z-30",
    style: { x: 34, y: 28, rotate: 6, scale: 0.95, opacity: 0.76 },
  },
  {
    className: "z-20",
    style: { x: -28, y: 52, rotate: -7, scale: 0.9, opacity: 0.42 },
  },
  {
    className: "z-10",
    style: { x: 24, y: 78, rotate: 8, scale: 0.85, opacity: 0.18 },
  },
] as const;

export function TuiShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const advanceFrame = useEffectEvent(() => {
    setActiveIndex((index) => (index + 1) % TUI_GALLERY_ITEMS.length);
  });

  useEffect(() => {
    if (reducedMotion) return;

    const intervalId = window.setInterval(advanceFrame, 3000);
    return () => window.clearInterval(intervalId);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !stackRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(stackRef.current, {
        y: -36,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const orderedItems = useMemo(
    () =>
      TUI_GALLERY_ITEMS.map(
        (_, index) => TUI_GALLERY_ITEMS[(activeIndex + index) % TUI_GALLERY_ITEMS.length]
      ),
    [activeIndex]
  );

  const activeItem = TUI_GALLERY_ITEMS[activeIndex];

  return (
    <SectionWrapper id="tui">
      <div ref={sectionRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
        >
          <motion.div variants={fadeInUp}>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet">
              TUI showcase
            </p>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-cool-white sm:text-4xl lg:text-[3.4rem] lg:leading-[1.03]">
              A terminal-native workspace that still feels like a product.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The TUI is where Stormlog’s workflows become tangible: quick start
              guidance, monitoring controls, visualization exports, diagnostics,
              and CLI-driven actions in a single interface.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-cool-white/45">
                Active frame
              </p>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-violet">{activeItem.tag}</p>
                  <h3 className="mt-2 font-heading text-2xl font-medium text-cool-white">
                    {activeItem.title}
                  </h3>
                </div>
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c1431] text-cool-white/80">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {activeItem.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {TUI_GALLERY_ITEMS.map((item, index) => (
                <button
                  key={`${item.title}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    index === activeIndex
                      ? "border-violet/30 bg-violet/10 text-cool-white"
                      : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-cool-white"
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <div className="glass-panel relative overflow-hidden rounded-[36px] p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.2),transparent_36%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-40 grid-bg" />

              <div className="relative min-h-[25rem] sm:min-h-[31rem]">
                <div ref={stackRef} className="hidden lg:block">
                  {orderedItems.slice(0, stackLayouts.length).map((item, index) => (
                    <motion.div
                      key={`${item.image}-${activeIndex}-${index}`}
                      animate={stackLayouts[index].style}
                      transition={{
                        duration: reducedMotion ? 0 : 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={cn(
                        "absolute inset-x-8 top-2 bottom-10 origin-center",
                        stackLayouts[index].className
                      )}
                    >
                      <div className="glass-panel h-full overflow-hidden rounded-[28px] p-2">
                        <div className="relative h-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#030816]">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(min-width: 1024px) 50vw, 100vw"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020611] via-transparent to-transparent opacity-65" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="relative lg:hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.image}
                      initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reducedMotion ? 0 : -16 }}
                      transition={{ duration: reducedMotion ? 0 : 0.35 }}
                      className="glass-panel overflow-hidden rounded-[28px] p-2"
                    >
                      <div className="relative aspect-[1411/859] overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#030816]">
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
