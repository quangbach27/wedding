import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import GuestbookForm from "./guestbook-form";

export default function GuestBookSection({
  reveal,
}: {
  reveal?: SectionReveal;
}) {
  return (
    <Section reveal={reveal}>
      <SectionHeading eyebrow="Sổ lưu bút" title="Gửi lời chúc phúc" />
      <GuestbookForm className="mx-auto max-w-3xl" />
    </Section>
  );
}
