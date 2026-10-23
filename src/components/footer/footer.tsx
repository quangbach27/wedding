"use client";
import { parseDatePart } from "@/lib/date";
import { useStore } from "../../stores/store";
import { Section, SectionHeading } from "../ui/section";

export default function Footer() {
  const { weddingDate } = useStore();
  const { month, day, year } = parseDatePart(weddingDate);

  return (
    <footer className="bg-cream/65 border-gold-light z-10 border-t text-xl">
      <Section className="py-4 md:py-8">
        <SectionHeading
          className="mb-5"
          eyebrow="Save the Date"
          title={`${day}.${month}.${year}`}
          subtitle="Cảm ơn vì đã ghé thăm trang cưới của Quang Bách & Hồng Vân."
        />
      </Section>
    </footer>
  );
}
