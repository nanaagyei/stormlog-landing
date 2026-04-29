import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createRevealAnimation(target: string | Element | Element[], trigger: string | Element) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 28 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger,
        start: "top 78%",
        once: true,
      },
    },
  );
}

export function createParallaxAnimation(target: string | Element, trigger: string | Element, distance = 48) {
  return gsap.fromTo(
    target,
    { y: -distance },
    {
      y: distance,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}
