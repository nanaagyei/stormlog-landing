"use client";

import Link from "next/link";
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a
            href="#overview"
            className="shrink-0 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-white"
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
                    "relative px-3 py-1.5 text-[13px] transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-1 -bottom-[calc(0.5rem+1px)] h-px bg-emerald"
                      transition={{ type: "spring", duration: 0.35, bounce: 0 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/blogs"
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <span className="h-3 w-px bg-white/[0.08]" />
            <a
              href={EXTERNAL_LINKS.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="size-3.5" />
              Docs
            </a>
            <a
              href={EXTERNAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-3.5" />
              GitHub
            </a>
            <div className="hidden xl:block">
              <CopyButton
                text={HERO_CONTENT.installCommand}
                displayText="pip install stormlog"
                className="!h-8 !px-3 !py-0 text-xs"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="rounded-lg border border-white/[0.06] p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="floating-nav-mobile-menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="floating-nav-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-50 border-b border-white/[0.06] bg-[#09090b]/95 px-4 py-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/blogs"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-white/[0.04]"
              >
                Blog
              </Link>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.slice(1);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-white/[0.04] text-foreground"
                        : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-3 flex gap-2 border-t border-white/[0.06] pt-3">
              <a
                href={EXTERNAL_LINKS.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-sm text-foreground"
              >
                <BookOpen className="size-3.5" />
                Docs
              </a>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2.5 text-sm text-muted-foreground"
              >
                <Github className="size-3.5" />
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
