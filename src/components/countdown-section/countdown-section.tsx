import Image from "next/image";
import Countdown from "./countdown";
import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";

export default function CountdownSection({
  reveal,
}: {
  reveal?: SectionReveal;
}) {
  return (
    <div className="relative overflow-hidden px-6 py-20 text-center md:py-28">
      <Image
        src="/background_forest.webp"
        alt="countdown-background"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <Section className="relative" reveal={reveal}>
        <SectionHeading
          className="dark"
          eyebrow="COUNTDOWN"
          title="Đếm ngược ngày trọng đại"
        />
        <div aria-hidden className="absolute inset-0 bg-black/40" />

        <Countdown
          className="mt-10 md:mt-12"
        />
      </Section>
    </div>
  );
}
