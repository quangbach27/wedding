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
      <HeroSection />
      <EventSection />
      <InvitationSection />
      <TimelineSection />
      <RsvpSection />
      <CountdownSection />
      <GuestBookSection />
      <Footer />
    </main>
  );
}
