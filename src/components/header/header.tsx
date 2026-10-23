import { Heart } from "lucide-react";
import { Section } from "../ui/section";

export default function Header() {
  return (
    <header className="bg-cream/65 z-10 text-xl md:text-2xl">
      <Section className="py-3 md:py-5">
        <div className="flex items-center gap-5">
          <span className="border-gold-light flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2">
            <Heart
              size={20}
              fill="currentColor"
              strokeWidth={0}
              className="text-gold"
            />
          </span>
          <div className="font-script text-ink leading-none">
            Welcome to our wedding
          </div>
        </div>
      </Section>
    </header>
  );
}
