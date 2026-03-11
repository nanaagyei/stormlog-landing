"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Github, Menu, X } from "lucide-react";
import { HERO_CONTENT } from "@/data/content";
import { EXTERNAL_LINKS, NAV_ITEMS } from "@/data/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

export function FloatingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionIds = useMemo(
    () => NAV_ITEMS.map((item) => item.href.slice(1)),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="fixed top-4 right-0 left-0 z-50 mx-auto w-full px-4 sm:top-6 sm:px-6"
      >
        <nav className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2.5 sm:px-4">
          <a
            href="#overview"
            className="shrink-0 rounded-full px-3 py-2 font-heading text-base font-semibold tracking-tight text-cool-white transition-colors hover:text-white"
          >
            Stormlog
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-cool-white"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.08]"
                      transition={{ type: "spring", duration: 0.45 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-sm text-cool-white transition-all hover:border-violet/40 hover:bg-white/[0.04]"
            >
              <BookOpen className="size-4" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.08] px-4 text-sm text-muted-foreground transition-all hover:border-white/15 hover:bg-white/[0.04] hover:text-cool-white"
            >
              <Github className="size-4" />
              GitHub
            </a>
            <div className="hidden xl:block">
              <CopyButton
                text={HERO_CONTENT.installCommand}
                displayText="pip install stormlog"
                className="!h-10 !px-4 !py-0 text-xs"
              />
            </div>
          </div>

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-full border border-white/[0.08] p-2.5 text-muted-foreground transition-colors hover:text-cool-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 right-4 left-4 z-50 rounded-[28px] border border-white/[0.08] bg-[#09122a]/95 p-4 shadow-[0_24px_90px_rgba(2,6,23,0.65)] backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.slice(1);

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm transition-colors",
                      isActive
                        ? "bg-white/[0.08] text-cool-white"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-cool-white"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
              <a
                href={EXTERNAL_LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-sm text-cool-white"
              >
                <BookOpen className="size-4" />
                Docs
              </a>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/[0.08] px-4 py-3 text-sm text-muted-foreground"
              >
                <Github className="size-4" />
                GitHub
              </a>
            </div>

            <CopyButton
              text={HERO_CONTENT.installCommand}
              displayText="pip install stormlog"
              className="mt-3 w-full justify-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
