import type { Variants, Transition } from "framer-motion";

export const GSAP_DEFAULTS = {
  duration: 1,
  ease: "power3.out" as const,
};

export const STAGGER_DELAY = 0.1;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: 0.1,
    },
  },
};

export const scaleOnHover = {
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" } as Transition,
};

export const glowOnHover = {
  boxShadow: "0 0 30px rgba(125, 211, 252, 0.15)",
  transition: { duration: 0.3 } as Transition,
};
