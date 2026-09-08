"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { StormlogMark } from "@/components/ui/stormlog-mark";
import { resolveIn, settle, stagger } from "@/lib/motion";

interface StatusScreenProps {
  /** Caption in the frame's chrome bar, e.g. "stormlog.dev". */
  frameLabel: string;
  /** Machine-voice lines inside the frame. The accent marks the status line. */
  frameLines: { text: string; accent?: boolean; dim?: boolean }[];
  title: string;
  description: ReactNode;
  actions: ReactNode;
}

/**
 * Shared chrome for the failure routes. The root layout carries no nav or
 * footer, so these screens supply their own way back.
 *
 * The frame is the system's signature Code Frame: a `deep` panel opened by a
 * hairline chrome bar with a mono caption. Using it here states the problem in
 * the product's own voice — the machine reporting what happened — instead of
 * the decorative "Oops!" a generic error page reaches for.
 */
export function StatusScreen({
  frameLabel,
  frameLines,
  title,
  description,
  actions,
}: StatusScreenProps) {
  return (
    <main className="flex min-h-dvh flex-col px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-white"
      >
        <StormlogMark className="size-5" />
        Stormlog
      </Link>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center py-16"
      >
        <motion.div
          variants={resolveIn}
          className="overflow-hidden rounded-xl border border-white/[0.06] bg-deep"
        >
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-dim">
              {frameLabel}
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-xs leading-relaxed sm:text-[13px]">
            {frameLines.map((line, i) => (
              <span
                key={i}
                className={
                  line.accent
                    ? "block text-emerald"
                    : line.dim
                      ? "block text-muted-dim"
                      : "block text-foreground/90"
                }
              >
                {line.text}
              </span>
            ))}
          </pre>
        </motion.div>

        <motion.h1
          variants={settle}
          className="mt-8 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={settle}
          className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div
          variants={settle}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          {actions}
        </motion.div>
      </motion.div>
    </main>
  );
}

export const statusPrimaryAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald px-5 text-sm font-medium text-deep transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

export const statusSecondaryAction =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-surface px-5 text-sm font-medium text-foreground transition-all hover:border-white/[0.12] hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
