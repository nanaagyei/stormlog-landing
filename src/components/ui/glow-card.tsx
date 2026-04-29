"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

export function GlowCard({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.06] bg-surface p-6 sm:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
