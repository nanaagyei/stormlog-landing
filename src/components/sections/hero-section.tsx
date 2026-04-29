"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BookOpen, Github } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { HERO_CONTENT } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { reveal, stagger } from "@/lib/motion";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !frameRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(frameRef.current, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    void video.play().catch(() => {});
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative px-4 pt-28 pb-16 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44 lg:pb-24"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex flex-col items-center text-center"
      >
        <motion.span
          variants={reveal}
          className="mono-label"
        >
          {HERO_CONTENT.eyebrow}
        </motion.span>

        <motion.h1
          variants={reveal}
          className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-[4.5rem]"
        >
          See GPU memory before
          <br className="hidden sm:block" />
          {" "}it breaks your training.
        </motion.h1>

        <motion.p
          variants={reveal}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {HERO_CONTENT.description}
        </motion.p>

        <motion.div
          variants={reveal}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href={EXTERNAL_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald px-5 text-sm font-medium text-deep transition-all hover:brightness-110"
          >
            <BookOpen className="size-3.5" />
            View docs
            <ArrowRight className="size-3.5" />
          </a>
          <a
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/[0.06] bg-surface px-5 text-sm font-medium text-foreground transition-all hover:border-white/[0.12] hover:bg-surface-2"
          >
            <Github className="size-3.5" />
            GitHub
          </a>
        </motion.div>

        <motion.div variants={reveal} className="mt-4">
          <CopyButton
            text={HERO_CONTENT.installCommand}
            displayText="pip install stormlog"
          />
        </motion.div>

        <motion.div
          variants={reveal}
          ref={frameRef}
          className="mt-14 w-full max-w-6xl sm:mt-16"
        >
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-deep">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/50">
                Stormlog overview
              </span>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground/30">
                real-time session
              </span>
            </div>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/tui-4.png"
                className="aspect-[2822/1728] w-full object-cover"
              >
                <source src="/images/overview.mp4" type="video/mp4" />
                <source src="/images/overview.mov" type="video/quicktime" />
              </video>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
