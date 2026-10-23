import { Section, SectionHeading } from "../ui/section";
import RsvpForm from "./rsvp-form";

export default function RsvpSection() {
  return (
    <Section>
      <SectionHeading eyebrow="Phản hồi lời mời" title="Xác nhận tham dự" />
      <RsvpForm className="mx-auto max-w-3xl" />
    </Section>
  );
}
