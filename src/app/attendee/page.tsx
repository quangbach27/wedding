import { timingSafeEqual } from "node:crypto";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AttendeeDashboard from "@/components/attendee/attendee-dashboard";
import { rsvpRepository } from "@/lib/repository/rsvp";

type SearchParams = Promise<{ code_challenge?: string | string[] }>;

export const metadata: Metadata = {
  title: "Danh sách khách tham dự",
  robots: {
    index: false,
    follow: false,
  },
};

const isValidChallenge = (
  received: string | string[] | undefined,
  expected: string,
) => {
  if (typeof received !== "string") return false;

  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return (
    receivedBytes.length === expectedBytes.length &&
    timingSafeEqual(receivedBytes, expectedBytes)
  );
};

async function AttendeeContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const expectedChallenge = process.env.ATTENDEE_CODE_CHALLENGE;
  if (!expectedChallenge) {
    throw new Error("ATTENDEE_CODE_CHALLENGE is not set");
  }

  const { code_challenge: challenge } = await searchParams;
  if (!isValidChallenge(challenge, expectedChallenge)) notFound();

  const attendees = await rsvpRepository.listAttendees();
  return <AttendeeDashboard attendees={attendees} />;
}

function AttendeeFallback() {
  return (
    <div aria-label="Đang tải danh sách khách tham dự" aria-busy="true">
      <div className="mb-8 flex flex-col items-center sm:mb-10">
        <div className="h-[188px] w-[216px] animate-pulse rounded-t-full rounded-b-2xl border border-[#dce5cd] bg-[#e8f0dc]" />
      </div>
      <div className="grid gap-8 md:grid-cols-2 md:gap-5">
        {["groom", "bride"].map((side) => (
          <section key={side} className="min-w-0">
            <div className="mb-3 h-8 w-40 animate-pulse rounded bg-[#e8f0dc]" />
            <div className="overflow-hidden rounded-2xl border border-[#e3e5d7] bg-white">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="h-[55px] animate-pulse border-b border-[#e3e5d7] last:border-b-0"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function AttendeePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-svh bg-[#f7f8f0] px-4 py-8 text-[#30392c] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-center font-serif text-2xl font-bold sm:mb-8 sm:text-3xl">
          Sổ khách tham dự
        </h1>
        <Suspense fallback={<AttendeeFallback />}>
          <AttendeeContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
