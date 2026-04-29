"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  wide = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-4 sm:px-6 lg:px-8",
        "py-16 sm:py-20 lg:py-24",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          wide ? "max-w-[1400px]" : "max-w-[1200px]"
        )}
      >
        {children}
      </div>
    </section>
  );
}
