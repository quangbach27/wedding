import { cn } from "@/lib/utils";

type Step = {
  time: string;
  label: string;
};

type Props = {
  steps: Step[];
  className?: string;
};

export default function Timeline({ steps, className }: Props) {
  return (
    <ol
      className={cn("relative grid", className)}
      style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
    >
      {/* Line behind the markers, level with their centers */}
      <span
        aria-hidden
        className="bg-gold-light absolute inset-x-0 top-4.5 h-px md:top-5.5"
      />

      {steps.map((step) => (
        <li
          key={step.time}
          className="relative flex flex-col items-center text-center"
        >
          {/* Ring + dot */}
          <span className="border-gold bg-cream relative z-10 flex h-9 w-9 items-center justify-center rounded-full border md:h-11 md:w-11">
            <span className="bg-gold h-2.5 w-2.5 rounded-full md:h-3 md:w-3" />
          </span>

          <time className="text-ink mt-4 font-serif text-base font-semibold md:text-xl">
            {step.time}
          </time>
          <span className="text-ink/70 mt-1 px-1 text-sm md:text-base">
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
