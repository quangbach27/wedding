"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  className?: string;
};

export default function Typewriter({ text, speed = 45, className }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(text.length);
      return;
    }
    if (count >= text.length) return;
    const t = setTimeout(() => setCount(count + 1), speed);
    return () => clearTimeout(t);
  }, [count, text, speed]);

  return (
    <p className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span
        aria-hidden
        className="bg-gold ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse"
      />
    </p>
  );
}
