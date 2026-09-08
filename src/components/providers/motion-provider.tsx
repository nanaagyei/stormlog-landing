"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Applies the user's `prefers-reduced-motion` setting to every Framer Motion
 * animation in the tree.
 *
 * Framer animates through JS rather than CSS transitions, so the global
 * `prefers-reduced-motion` block in globals.css — which clamps
 * animation/transition durations — never reaches it. Framer's own default is
 * `reducedMotion: "never"`, so without this the section reveals played
 * regardless of the setting. `"user"` disables transform and layout animation
 * while keeping opacity, so content still fades in rather than snapping.
 *
 * This is the single motion gate for the site; GSAP was removed in favour of
 * Framer's `useScroll`/`useTransform`, so every animation now honours the
 * preference through this one wrapper.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
