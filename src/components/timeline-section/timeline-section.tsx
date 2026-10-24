import { Section } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import Timeline from "./timeline";

const STEPS = [
  { time: "11:00", label: "Đón khách" },
  { time: "12:00", label: "Lễ thành hôn" },
  { time: "12:30", label: "Khai tiệc" },
];

export default function TimelineSection({
  sectionClassName,
}: {
  sectionClassName?: string;
}) {
  return (
    <Section className={sectionClassName}>
      <SectionHeading
        eyebrow="Chương trình đón khách"
        title="Thời gian đón khách"
      />
      <Timeline steps={STEPS} className="mx-auto max-w-3xl" />
    </Section>
  );
}
