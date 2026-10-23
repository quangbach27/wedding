import { Section, SectionHeading } from "../ui/section";
import GuestbookForm from "./guestbook-form";

export default function GuestBookSection() {
  return (
    <Section>
      <SectionHeading eyebrow="Sổ lưu bút" title="Gửi lời chúc phúc" />
      <GuestbookForm className="mx-auto max-w-3xl" />
    </Section>
  );
}
