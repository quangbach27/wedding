import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-12 flex flex-col items-center text-center", className)}
    >
      {eyebrow && (
        <span className="text-gold text-xs font-bold tracking-[0.4em] uppercase md:text-sm">
          {eyebrow}
        </span>
      )}

      <h2 className="text-ink mt-5 font-serif text-4xl leading-tight font-medium italic md:text-5xl">
        {title}
      </h2>

      {subtitle && (
        <p className="text-ink/70 mt-6 text-xs font-semibold tracking-[0.25em] uppercase md:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

type SectionProps = {
  className?: string;
  children: React.ReactNode;
};

export function Section({ className, children }: SectionProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-6xl px-6 py-10 md:py-14", className)}
    >
      {children}
    </section>
  );
}
