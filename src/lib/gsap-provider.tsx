"use client";

import { useEffect, createContext, useContext, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GsapContext = createContext<typeof gsap | null>(null);

export function useGsap() {
  return useContext(GsapContext);
}

export function GsapProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.globalTimeline.timeScale(0);
      ScrollTrigger.defaults({ animation: undefined });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      mm.revert();
    };
  }, []);

  return (
    <GsapContext.Provider value={gsap}>{children}</GsapContext.Provider>
  );
}
