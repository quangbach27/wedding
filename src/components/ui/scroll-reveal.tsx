"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".reveal");

    // Skip animation entirely if the user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("reveal-visible");
          obs.unobserve(el);

          // Release the GPU layer after the animation finishes
          window.setTimeout(() => {
            el.style.willChange = "auto";
          }, 1600);
        });
      },
      {
        // threshold 0 + bottom margin works for sections of ANY height,
        // including ones taller than a phone screen
        threshold: 0,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
