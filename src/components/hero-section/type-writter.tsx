"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getReducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getReducedMotionServer = () => false;

type TypewriterProps = {
  text: string;
  className?: string;
  speed?: number; // ms per character
  startDelay?: number; // ms
};

export default function Typewriter({
  text,
  className,
  speed = 45,
  startDelay = 300,
}: TypewriterProps) {
  const words = useMemo(
    () =>
      text
        .normalize("NFC")
        .split(" ")
        .map((w) => Array.from(w)),
    [text],
  );
  const total = useMemo(
    () => words.reduce((sum, w) => sum + w.length + 1, 0),
    [words],
  );

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );

  const [typed, setTyped] = useState({ text, count: 0 });

  // Reset when `text` changes, during render (React-approved pattern)
  if (typed.text !== text) {
    setTyped({ text, count: 0 });
  }

  // Derived value: no setState needed for reduced motion
  const count = reducedMotion ? total : typed.count;

  useEffect(() => {
    if (reducedMotion) return;

    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setTyped((prev) => {
          if (prev.count >= total) {
            window.clearInterval(interval);
            return prev;
          }
          return { ...prev, count: prev.count + 1 };
        });
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [reducedMotion, total, speed, startDelay]);

  let index = 0;

  return (
    <p className={className} aria-label={text}>
      {words.map((chars, wi) => {
        const wordStart = index;
        index += chars.length + 1;

        return (
          <span key={wi} aria-hidden>
            <span className="inline-block whitespace-nowrap">
              {chars.map((ch, ci) => (
                <span
                  key={ci}
                  className={wordStart + ci < count ? "visible" : "invisible"}
                >
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && " "}
          </span>
        );
      })}
    </p>
  );
}
