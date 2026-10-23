"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../stores/store";
import MonthCalendar from "./calendar";
import { parseDatePart } from "@/lib/date";

type EventCalendarProps = {
  className?: string;
};

export default function EventCalendar({ className }: EventCalendarProps) {
  const { weddingDate, weddingLunarDate, weddingVenue } = useStore();
  const { day, month, year } = parseDatePart(weddingDate);
  return (
    <div
      className={cn(
        "border-gold-light z-10 max-w-130 rounded-lg border px-5 py-5 md:px-12 md:py-11",
        className,
      )}
    >
      <div className="flex items-end justify-center gap-4 md:gap-6">
        <div className="border-gold-light w-28 border-t-2 pt-3 text-center md:w-40">
          <span className="text-ink/80 text-lg md:text-2xl">Tháng {month}</span>
        </div>

        <span className="text-gold font-serif text-7xl leading-[0.8] md:text-8xl">
          {day}
        </span>

        <div className="border-gold-light w-28 border-t-2 pt-3 text-center md:w-40">
          <span className="text-ink/80 text-lg md:text-2xl">{year}</span>
        </div>
      </div>
      <p className="text-ink/60 mt-6 text-center text-sm md:text-base">
        (Nhằm {weddingLunarDate})
      </p>

      <MonthCalendar
        year={weddingDate.getFullYear()}
        month={weddingDate.getMonth() + 1}
        highlightDay={weddingDate.getDate()}
      />

      {/* Venue */}
      <h3 className="text-ink mt-4 text-center text-base font-bold tracking-wide uppercase">
        {`Tại ${weddingVenue.name}`}
      </h3>

      <div className="border-gold-light/80 mt-6 overflow-hidden rounded-2xl border">
        <iframe
          title="Bản đồ địa điểm"
          src={weddingVenue.mapSrc}
          className="h-60 w-full md:h-70"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <a
        href={weddingVenue.redirectMapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green mt-5 flex items-center justify-center gap-2 font-semibold tracking-wide transition-transform hover:translate-x-1"
      >
        Xem chỉ đường <ArrowRight size={18} />
      </a>
    </div>
  );
}
