"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SectionReveal = "left" | "right";

type SectionProps = {
  className?: string;
  reveal?: SectionReveal;
  children: React.ReactNode;
};

export function Section({ className, reveal, children }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !reveal) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [reveal]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "mx-auto w-full max-w-6xl px-6 py-10 md:py-14",
        className,
        reveal && "reveal",
        reveal && `reveal-${reveal}`,
        isVisible && "reveal-visible",
      )}
    >
      {children}
    </section>
  );
}
