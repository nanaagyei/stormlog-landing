"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ContainerScrollProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}

export function ContainerScroll({
  children,
  header,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);

  if (reducedMotion) {
    return (
      <div className={cn("relative", className)} ref={containerRef}>
        {header}
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("relative", className)}
      ref={containerRef}
      style={{ perspective: "1200px" }}
    >
      {header}
      <motion.div
        style={{ scale, opacity, rotateX }}
        className="origin-bottom"
      >
        {children}
      </motion.div>
    </div>
  );
}
