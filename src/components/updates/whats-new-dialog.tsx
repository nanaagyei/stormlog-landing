"use client";

import { useCallback, useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import {
  PRODUCT_UPDATES,
  WHATS_NEW_META,
  WHATS_NEW_VERSION,
} from "@/data/updates";
import { EXTERNAL_LINKS, STORMLOG_VERSION } from "@/data/navigation";
import { CodeSnippet } from "@/components/ui/code-snippet";
import { CopyButton } from "@/components/ui/copy-button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const STORAGE_KEY = `stormlog:whats-new:${WHATS_NEW_VERSION}`;
const TOTAL = PRODUCT_UPDATES.length;

export function WhatsNewDialog() {
  const [open, setOpen] = useState(false);
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const prefersReducedMotion = useReducedMotion();

  // Auto-open once for first-time visitors of this update set.
  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      seen = true;
    }
    if (seen) return;

    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const markSeen = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // Storage unavailable (private mode / disabled) — popup just reopens later.
    }
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) {
        markSeen();
        // Reset to the headline slide for the next time it is opened.
        setSlide([0, 0]);
      }
    },
    [markSeen]
  );

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, next));
    setSlide(([current]) => [clamped, clamped > current ? 1 : -1]);
  }, []);

  const update = PRODUCT_UPDATES[index];
  const isLast = index === TOTAL - 1;
  const slideOffset = prefersReducedMotion ? 0 : 32;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {/* Persistent re-open trigger, available across the site. */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-surface px-3.5 py-2 text-[13px] text-muted-foreground shadow-lg shadow-black/30 transition-colors hover:border-white/20 hover:text-foreground"
          aria-label="See what's new in Stormlog"
        >
          <span className="size-1.5 rounded-full bg-emerald" />
          <span className="hidden sm:inline">What&apos;s new</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/70"
              />
            </Dialog.Overlay>

            <Dialog.Content
              asChild
              forceMount
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
                transition={{ duration: 0.25, ease: EASE }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") goTo(index + 1);
                  if (event.key === "ArrowLeft") goTo(index - 1);
                }}
                className="fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-surface shadow-2xl shadow-black/50"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 pb-5 pt-6">
                  <div>
                    <span className="mono-label">
                      {WHATS_NEW_META.eyebrow} · v{STORMLOG_VERSION}
                    </span>
                    <Dialog.Title className="mt-2 font-heading text-xl font-semibold tracking-[-0.02em] text-foreground">
                      {WHATS_NEW_META.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {WHATS_NEW_META.description}
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    className="shrink-0 rounded-md border border-white/[0.06] p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                {/* Slides */}
                <div className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={update.id}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * slideOffset }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -slideOffset }}
                      transition={{ duration: 0.24, ease: EASE }}
                    >
                      <span className="mono-label">{update.kicker}</span>
                      <h3 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.02em] text-foreground">
                        {update.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {update.summary}
                      </p>

                      <ul className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
                        {update.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-3">
                            <span className="mt-1.5 h-px w-3.5 shrink-0 bg-emerald" />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                              {highlight}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5 flex flex-col gap-3">
                        <CopyButton
                          text={update.command}
                          className="w-full justify-start overflow-x-auto whitespace-nowrap !text-xs"
                        />
                        <CodeSnippet code={update.code} label={update.codeLabel} />
                      </div>

                      <a
                        href={EXTERNAL_LINKS.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Read the docs
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer / carousel controls */}
                <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      {PRODUCT_UPDATES.map((slide, dotIndex) => (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => goTo(dotIndex)}
                          className={cn(
                            "h-1.5 rounded-full transition-all",
                            dotIndex === index
                              ? "w-5 bg-emerald"
                              : "w-1.5 bg-white/15 hover:bg-white/30"
                          )}
                          aria-label={`Go to update ${dotIndex + 1}`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground/50">
                      {index + 1} / {TOTAL}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goTo(index - 1)}
                      disabled={index === 0}
                      className="inline-flex size-8 items-center justify-center rounded-md border border-white/[0.06] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                      aria-label="Previous update"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                    {isLast ? (
                      <button
                        type="button"
                        onClick={() => handleOpenChange(false)}
                        className="inline-flex h-8 items-center rounded-md bg-emerald px-3.5 text-sm font-medium text-deep transition-colors hover:bg-emerald/90"
                      >
                        Got it
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => goTo(index + 1)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/[0.06] px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Next update"
                      >
                        Next
                        <ArrowRight className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
