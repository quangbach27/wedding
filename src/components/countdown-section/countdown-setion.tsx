import Image from "next/image";
import Countdown from "./countdown";
import { Section, SectionHeading } from "../ui/section";

export default function CountdownSection() {
  return (
    <div className="relative overflow-hidden px-6 py-20 text-center md:py-28">
      <Image
        src="/background_forest.png"
        alt="countdown-background"
        fill
        sizes="100vw"
        className="object-cover"
      />

      <Section className="relative">
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
