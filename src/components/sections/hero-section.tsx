"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, BookOpen, Github, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { HERO_CONTENT } from "@/data/content";
import { EXTERNAL_LINKS } from "@/data/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !frameRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(frameRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-floating-tag]").forEach((tag, index) => {
        gsap.to(tag, {
          y: index % 2 === 0 ? -24 : 18,
          x: index % 2 === 0 ? 16 : -14,
          rotate: index % 2 === 0 ? -3 : 3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    void video.play().catch(() => {
      // Fallback is the poster frame when autoplay is blocked.
    });
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40 lg:pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.24),transparent_56%)]" />
        <div className="absolute top-24 left-[12%] h-56 w-56 rounded-full bg-violet/20 blur-[120px]" />
        <div className="absolute right-[8%] bottom-24 h-72 w-72 rounded-full bg-cyan/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-70 grid-bg" />
        <div className="absolute inset-0 opacity-50 noise-overlay" />
        <div className="absolute inset-0 opacity-40 constellation-bg" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center"
      >
        <motion.div variants={fadeInUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-violet sm:text-sm">
            <Sparkles className="size-3.5" />
            {HERO_CONTENT.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="mt-8 max-w-5xl font-heading text-4xl font-semibold leading-[1.02] tracking-tight text-cool-white sm:text-6xl lg:text-[5.5rem]"
        >
          {HERO_CONTENT.title.split("training.")[0]}
          <span className="text-gradient-violet"> training.</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
        >
          {HERO_CONTENT.description}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {HERO_CONTENT.supportLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-cool-white/85"
            >
              {label}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={EXTERNAL_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#120d2a] transition-all hover:translate-y-[-1px] hover:bg-violet-50"
          >
            <BookOpen className="size-4" />
            View docs
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
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-5">
          <CopyButton
            text={HERO_CONTENT.installCommand}
            displayText="pip install stormlog"
          />
        </motion.div>

        <motion.div variants={fadeInUp} className="relative mt-14 w-full sm:mt-16">
          {HERO_CONTENT.floatingTags.map((tag, index) => {
            const positions = [
              "top-6 left-4 sm:left-8",
              "top-10 right-2 sm:right-10",
              "bottom-10 left-6 sm:left-12",
              "bottom-12 right-4 sm:right-16",
            ];

            return (
              <span
                key={tag}
                data-floating-tag
                className={`pointer-events-none absolute z-20 hidden rounded-full border border-white/[0.1] bg-[#0d1632]/80 px-4 py-2 text-xs font-medium text-cool-white shadow-[0_18px_40px_rgba(2,6,23,0.4)] backdrop-blur-xl lg:inline-flex ${positions[index]}`}
              >
                {tag}
              </span>
            );
          })}

          <div
            ref={frameRef}
            className="glass-panel relative overflow-hidden rounded-[32px] p-2 shadow-[0_40px_120px_rgba(1,3,10,0.7)] sm:p-3"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.2),transparent_34%)]" />
            <div className="relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#050913]">
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
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#081124]/85 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050913] to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-cool-white/55 sm:top-5 sm:left-6 sm:right-6">
                <span>Stormlog overview</span>
                <span>Real-time session playback</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
