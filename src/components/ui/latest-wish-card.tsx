"use client";

import { useEffect, useState } from "react";
import { WishCard } from "./wish-card";
import { Wish } from "@/lib/repository/wish";

export default function LatestWish({
  initial,
  intervalMs = 15_000,
}: {
  initial?: Wish | null;
  intervalMs?: number;
}) {
  const [state, setState] = useState({ wish: initial, fresh: false });

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/wishes/latest", { cache: "no-store" });
        if (!res.ok) return;
        const next: Wish | null = await res.json();
        if (cancelled || !next) return;
        setState((prev) =>
          prev.wish?.id === next.id ? prev : { wish: next, fresh: true },
        );
      } catch {
        /* try again on the next tick */
      }
    };

    const timer = window.setInterval(refresh, intervalMs);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("wishes:changed", refresh);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("wishes:changed", refresh);
    };
  }, [intervalMs]);

  const { wish, fresh } = state;
  if (!wish) return null;

  return (
    <WishCard
      key={wish.id} // resets the expanded state for each new wish
      variant="highlight"
      name={wish.name}
      message={wish.message}
      createdAt={wish.createdAt}
      animateIn={fresh}
    />
  );
}
