"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            obs.unobserve(entry.target); // Stop observing once it has animated
          }
        });
      },
      {
        threshold: 0.15, // Triggers when 15% of the element enters the viewport
        rootMargin: "0px 0px -50px 0px", // Triggers slightly before it hits the bottom
      },
    );

    // Find all elements with the "reveal" class
    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
