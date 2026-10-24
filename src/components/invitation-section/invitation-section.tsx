import { Section } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import InvitationCard from "./invitation-card";

export default function InvitationSection({
  sectionClassName,
}: {
  sectionClassName?: string;
}) {
  return (
    <Section className={sectionClassName}>
      <SectionHeading eyebrow="Gia đình hai bên" title="Thư mời" />
      <InvitationCard />
    </Section>
  );
}
