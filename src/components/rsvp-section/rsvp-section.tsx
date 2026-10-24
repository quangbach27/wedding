import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import RsvpForm from "./rsvp-form";

export default function RsvpSection({
  reveal,
}: {
  reveal?: SectionReveal;
}) {
  return (
    <Section reveal={reveal}>
      <SectionHeading eyebrow="Phản hồi lời mời" title="Xác nhận tham dự" />
      <RsvpForm className="mx-auto max-w-3xl" />
    </Section>
  );
}
