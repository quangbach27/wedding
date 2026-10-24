import CountdownSection from "@/components/countdown-section/countdown-setion";
import EventSection from "@/components/event-section/event-section";
import Footer from "@/components/footer/footer";
import GuestBookSection from "@/components/guestbook-section/guestbook-section";
import HeroSection from "@/components/hero-section/hero-section";
import InvitationSection from "@/components/invitation-section/invitation-section";
import RsvpSection from "@/components/rsvp-section/rsvp-section";
import TimelineSection from "@/components/timeline-section/timeline-section";
import Background from "@/components/ui/background";

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <HeroSection sectionClassName="min-h-svh" />
      <EventSection sectionClassName="reveal reveal-left" />
      <InvitationSection sectionClassName="reveal reveal-right" />
      <TimelineSection sectionClassName="reveal reveal-left" />
      <RsvpSection sectionClassName="reveal reveal-right" />
      <CountdownSection sectionClassName="reveal reveal-left" />
      <GuestBookSection sectionClassName="reveal reveal-right" />
      <Footer />
    </main>
  );
}
