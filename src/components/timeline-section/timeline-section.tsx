import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import Timeline from "./timeline";

const STEPS = [
  { time: "11:00", label: "Đón khách" },
  { time: "11:30", label: "Lễ thành hôn" },
  { time: "12:00", label: "Khai tiệc" },
];

export default function TimelineSection({
  reveal,
}: {
  reveal?: SectionReveal;
}) {
  return (
    <Section reveal={reveal}>
      <SectionHeading
        eyebrow="Chương trình đón khách"
        title="Thời gian đón khách"
      />
      <Timeline steps={STEPS} className="mx-auto max-w-3xl" />
    </Section>
  );
}
