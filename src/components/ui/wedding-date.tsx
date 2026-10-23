"use client";

import { cn } from "@/lib/utils";
import { useStore } from "../../stores/store";
import { parseDatePart } from "@/lib/date";

export default function WeddingDate({ className }: { className?: string }) {
  const { weddingDate } = useStore();
  const { day, month, year } = parseDatePart(weddingDate);
  return (
    <p className={cn("text-ink/80 font-serif text-2xl md:text-3xl", className)}>
      {day} Tháng {month}, {year}
    </p>
  );
}
