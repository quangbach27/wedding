import { Suspense } from "react";
import { connection } from "next/server";
import CountdownSection from "@/components/countdown-section/countdown-setion";
import EventSection from "@/components/event-section/event-section";
import Footer from "@/components/footer/footer";
import GuestBookSection from "@/components/guestbook-section/guestbook-section";
import HeroSection from "@/components/hero-section/hero-section";
import InvitationSection from "@/components/invitation-section/invitation-section";
import RsvpSection from "@/components/rsvp-section/rsvp-section";
import TimelineSection from "@/components/timeline-section/timeline-section";
import Background from "@/components/ui/background";

async function StreamingSections() {
  await connection();

  return (
    <>
      <EventSection reveal="left" />
      <InvitationSection reveal="right" />
      <TimelineSection reveal="left" />
      <RsvpSection reveal="right" />
      <CountdownSection reveal="left" />
      <GuestBookSection reveal="right" />
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <main className="relative">
      <Background />
      <HeroSection sectionClassName="min-h-svh" />
      <Suspense fallback={<div aria-hidden className="min-h-[40vh]" />}>
        <StreamingSections />
      </Suspense>
    </main>
  );
}
