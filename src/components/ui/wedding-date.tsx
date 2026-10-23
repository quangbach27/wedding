"use client";

import { cn } from "@/lib/utils";
import { useStore } from "../stores/store";

export default function WeddingDate({ className }: { className?: string }) {
  const { weddingDate } = useStore();
  return (
    <p className={cn("text-ink/80 font-serif text-2xl md:text-3xl", className)}>
      {String(weddingDate.getDate()).padStart(2, "0")} Tháng{" "}
      {weddingDate.getMonth()}, {weddingDate.getFullYear()}
    </p>
  );
}
