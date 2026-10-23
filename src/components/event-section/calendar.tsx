import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// Empty slots before day 1, then 1..daysInMonth
const getMonthCells = (year: number, month: number): (number | null)[] => {
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month, 0).getDate();

  return [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
};

type MonthCalendarProps = {
  year: number;
  month: number; // 1-12
  highlightDay?: number;
  className?: string;
};

export default function MonthCalendar({
  year,
  month,
  highlightDay,
  className,
}: MonthCalendarProps) {
  const cells = getMonthCells(year, month);

  return (
    <div className={cn("grid grid-cols-7 text-center", className)}>
      {WEEKDAYS.map((d) => (
        <div key={d} className="text-green py-2 text-xs font-bold md:text-sm">
          {d}
        </div>
      ))}

      {cells.map((day, i) => {
        const selected = day === highlightDay;
        return (
          <div
            key={i}
            className="relative flex h-10 items-center justify-center md:h-12"
          >
            {day && (
              <>
                {selected && (
                  <Heart
                    aria-hidden
                    fill="currentColor"
                    strokeWidth={0}
                    className="text-green absolute h-10 w-10 animate-pulse md:h-11 md:w-11"
                  />
                )}
                <span
                  className={cn(
                    "relative text-base md:text-lg",
                    selected ? "font-bold text-white" : "text-ink",
                  )}
                >
                  {day}
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
