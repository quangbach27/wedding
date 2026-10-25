import dynamic from "next/dynamic";

import HeroSection from "@/components/hero-section/hero-section";
import Background from "@/components/ui/background";

export const instant = false;

const TimelineSection = dynamic(
  () => import("@/components/timeline-section/timeline-section"),
);

const InvitationSection = dynamic(
  () => import("@/components/invitation-section/invitation-section"),
);
const EventSection = dynamic(
  () => import("@/components/event-section/event-section"),
);
const RsvpSection = dynamic(
  () => import("@/components/rsvp-section/rsvp-section"),
);
const CountdownSection = dynamic(
  () => import("@/components/countdown-section/countdown-section"),
);
const GuestBookSection = dynamic(
  () => import("@/components/guestbook-section/guestbook-section"),
);
const Footer = dynamic(() => import("@/components/footer/footer"));

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <HeroSection sectionClassName="min-h-svh" />
      <EventSection reveal="left" />
      <InvitationSection reveal="right" />
      <TimelineSection reveal="left" />
      <RsvpSection reveal="right" />
      <CountdownSection reveal="left" />
      <GuestBookSection reveal="right" />
      <Footer />
    </main>
  );
}
