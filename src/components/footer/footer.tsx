"use client";
import { useStore } from "../stores/store";
import { Section, SectionHeading } from "../ui/section";

export default function Footer() {
  const { weddingDate } = useStore();
  const title = `${String(weddingDate.getDate()).padStart(2, "0")}.${weddingDate.getMonth()}.${weddingDate.getFullYear()}`;

  return (
    <footer className="bg-cream/65 border-gold-light z-10 border text-xl">
      <Section>
        <SectionHeading
          eyebrow="Save the Date"
          title={title}
          subtitle="Cảm ơn vì đã ghé thă trang cưới của Quang Bách & Hồng Vân"
        />
      </Section>
    </footer>
  );
}
