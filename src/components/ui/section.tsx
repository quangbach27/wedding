"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function Section({ className, children }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasRevealClass = className?.split(/\s+/).includes("reveal");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasRevealClass) return;

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
  }, [hasRevealClass]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "mx-auto w-full max-w-6xl px-6 py-10 md:py-14",
        className,
        isVisible && "reveal-visible",
      )}
    >
      {children}
    </section>
  );
}
