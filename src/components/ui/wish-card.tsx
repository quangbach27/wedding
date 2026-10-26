"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatRelative, useNow } from "@/hooks/use-now";

// The card's own props. It doesn't import the Wish type from the repository,
// so it works with any data source: API, mock data, Storybook, tests.
export type WishCardProps = {
  name: string;
  message: string;
  createdAt: string | Date; // ISO string or Date
  variant?: "default" | "highlight";
  badge?: string; // shown on the highlight variant
  animateIn?: boolean;
  className?: string;
};

export function WishCard({
  name,
  message,
  createdAt,
  variant = "default",
  badge = "Lời chúc mới nhất",
  animateIn = false,
  className = "",
}: WishCardProps) {
  const now = useNow();
  const iso = new Date(createdAt).toISOString();
  const highlight = variant === "highlight";

  return (
    <article
      className={`relative flex gap-4 rounded-2xl transition-shadow duration-300 ${
        highlight
          ? "border-gold border-2 bg-linear-to-br from-white via-[#fffdf6] to-[#f6f7e8] p-5 pt-7 shadow-[0_14px_30px_-18px_rgba(47,61,34,0.38)] sm:p-6 sm:pt-8"
          : "border-gold/20 border bg-white/90 p-4 shadow-sm hover:shadow-md"
      } ${animateIn ? "wish-in" : ""} ${className}`}
    >
      {highlight && (
        <span className="bg-gold-dark absolute -top-3 left-5 flex items-center gap-2 rounded-full border-2 border-[#fffdf6] px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-sm sm:left-6">
          <span aria-hidden className="size-2 rounded-full bg-amber-200" />
          {badge}
        </span>
      )}

      <WishAvatar
        name={name}
        color={highlight ? "bg-gold-dark" : undefined}
        className={
          highlight
            ? "size-12 text-lg ring-4 ring-white/80 sm:size-14 sm:text-xl"
            : "size-12 text-lg"
        }
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className={`text-ink truncate font-semibold ${
              highlight ? "text-lg sm:text-xl" : "text-lg"
            }`}
          >
            {name}
          </h3>
          <time
            dateTime={iso}
            className="text-ink/55 shrink-0 text-xs font-medium sm:text-sm"
          >
            {formatRelative(iso, now)}
          </time>
        </div>

        <WishMessage text={message} lines={2} />
      </div>
    </article>
  );
}
const COLORS = [
  "bg-gold-dark",
  "bg-olive-600",
  "bg-olive-700",
  "bg-emerald-700",
];

function colorFor(name: string) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

export function WishAvatar({
  name,
  className = "size-12 text-lg",
  color, // pass a fixed color to skip the name-based one
}: {
  name: string;
  className?: string;
  color?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        color ?? colorFor(name)
      } ${className}`}
    >
      {initial}
    </span>
  );
}
export function WishMessage({ text, lines = 3 }: { text: string; lines?: 2 | 3 | 4 }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const expandedRef = useRef(false);
  const id = useId();

  useEffect(() => {
    expandedRef.current = expanded;
  }, [expanded]);

  // Detect whether the clamped text is cut off; re-check when width changes
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      if (expandedRef.current) return;
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const clamp = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" }[
    lines
  ];

  return (
    <>
      <p
        ref={ref}
        id={id}
        className={`text-ink/80 mt-1 wrap-break-word whitespace-pre-wrap ${
          expanded ? "" : clamp
        }`}
      >
        {text}
      </p>

      {(overflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={id}
          className="text-gold-dark mt-1 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className={`size-4 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </>
  );
}
