import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import InvitationCard from "./invitation-card";

export default function InvitationSection({
  reveal,
}: {
  reveal?: SectionReveal;
}) {
  return (
    <Section reveal={reveal}>
      <SectionHeading eyebrow="Gia đình hai bên" title="Thư mời" />
      <InvitationCard />
    </Section>
  );
}
