"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "../../stores/store";

type Props = {
  className?: string;
};

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
};

const ZERO: Parts = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: false,
};

function getParts(time: number): Parts {
  const diff = Math.max(0, time - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    finished: diff === 0,
  };
}

/* One half of a card, showing the top or bottom part of a centered digit */
function Half({
  value,
  side,
  className,
}: {
  value: string;
  side: "top" | "bottom";
  className?: string;
}) {
  const isTop = side === "top";
  return (
    <span
      className={cn(
        "absolute inset-x-0 overflow-hidden backface-hidden",
        isTop
          ? "top-0 h-1/2 rounded-t-lg bg-linear-to-b from-neutral-200 to-white"
          : "bottom-0 h-1/2 rounded-b-lg bg-white shadow-[inset_0_8px_8px_-8px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-x-0 flex h-[200%] items-center justify-center leading-none",
          isTop ? "top-0" : "bottom-0",
        )}
      >
        {value}
      </span>
    </span>
  );
}

function Digit({ value }: { value: string }) {
  // Remember the previous value so we can flip from old to new
  const [pair, setPair] = useState({ now: value, before: value });
  if (pair.now !== value) setPair({ now: value, before: pair.now });
  const changed = pair.now !== pair.before;

  return (
    <span className="text-ink relative block h-12 w-8 rounded-lg font-serif text-3xl font-semibold lining-nums tabular-nums shadow-[0_10px_24px_-8px_rgba(0,0,0,0.45)] perspective-near md:h-24 md:w-16 md:text-6xl">
      {/* Static halves: new value on top, old value below until the flap lands */}
      <Half value={pair.now} side="top" />
      <Half value={pair.before} side="bottom" />

      {changed && (
        <>
          {/* Old top half folds down */}
          <Half
            key={`t-${pair.now}`}
            value={pair.before}
            side="top"
            className="flip-top z-10 origin-bottom animate-[flip-top_0.3s_ease-in_forwards]"
          />
          {/* New bottom half lands */}
          <Half
            key={`b-${pair.now}`}
            value={pair.now}
            side="bottom"
            className="flip-bottom z-10 origin-top animate-[flip-bottom_0.3s_ease-out_0.3s_both]"
          />
        </>
      )}

      {/* Hinge line and side notches */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/20"
      />
      <span
        aria-hidden
        className="absolute top-1/2 left-0 z-20 h-2 w-0.75 -translate-y-1/2 rounded-r bg-black/25"
      />
      <span
        aria-hidden
        className="absolute top-1/2 right-0 z-20 h-2 w-0.75 -translate-y-1/2 rounded-l bg-black/25"
      />
    </span>
  );
}

function Unit({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  // Two digits by default, more if the number is larger (e.g. 100 days)
  const digits = String(value).padStart(2, "0").split("");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div aria-hidden className="flex gap-1 md:gap-1.5">
        {digits.map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </div>
      <span className="mt-3 text-[10px] font-semibold tracking-[0.25em] text-white uppercase [text-shadow:0_1px_6px_rgba(0,0,0,0.7)] md:mt-4 md:text-sm">
        {label}
      </span>
    </div>
  );
}

/* Two gold dots between units, same height as the cards */
function Colon() {
  return (
    <span
      aria-hidden
      className="flex h-12 flex-col justify-center gap-3 md:h-24"
    >
      <i className="bg-gold-light h-1.5 w-1.5 rounded-full" />
      <i className="bg-gold-light h-1.5 w-1.5 rounded-full" />
    </span>
  );
}

export default function Countdown({ className }: Props) {
  const { weddingDate } = useStore();
  const time = weddingDate.getTime();

  // null until mounted, so the server and the browser render the same HTML
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => setParts(getParts(time));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [time]);

  const p = parts ?? ZERO;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Plain text for screen readers: the digits are hidden from them */}
      <p className="sr-only" role="timer">
        Còn {p.days} ngày {p.hours} giờ {p.minutes} phút {p.seconds} giây
      </p>

      <div className="flex items-start justify-center gap-3 md:gap-5">
        <Unit value={p.days} label="Ngày" />
        <Colon />
        <Unit value={p.hours} label="Giờ" />
        <Colon />
        <Unit value={p.minutes} label="Phút" />
        <Colon />
        <Unit value={p.seconds} label="Giây" className="hidden md:block" />
      </div>

      {p.finished && (
        <p className="mt-6 font-serif text-2xl text-white italic md:text-3xl">
          Hôm nay là ngày trọng đại!
        </p>
      )}
    </div>
  );
}
