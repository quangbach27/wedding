import { Section, SectionHeading } from "../ui/section";
import InvitationCard from "./invitation-card";

export default function InvitationSection() {
  return (
    <Section>
      <SectionHeading eyebrow="Gia đình hai bên" title="Thư mời" />
      <InvitationCard />
    </Section>
  );
}
