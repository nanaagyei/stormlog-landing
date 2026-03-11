"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
}

export function GlowCard({
  children,
  className,
  hoverGlow = true,
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={
        hoverGlow
          ? {
              y: -4,
              boxShadow:
                "0 32px 80px rgba(2, 6, 23, 0.52), 0 0 60px rgba(167, 139, 250, 0.12)",
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-panel relative overflow-hidden rounded-[28px]",
        "p-6 sm:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(167,139,250,0.16),transparent_42%)] opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </motion.div>
  );
}
