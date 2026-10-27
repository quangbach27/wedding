"use client";

import { useState } from "react";
import type { Attendee } from "@/lib/repository/rsvp";

const PAGE_SIZE = 6;

type AttendeeSide = Attendee["side"];

const sideLabels: Record<AttendeeSide, string> = {
  groom: "Nhà trai",
  bride: "Nhà gái",
};

function AttendeeList({
  side,
  attendees,
}: {
  side: AttendeeSide;
  attendees: Attendee[];
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(attendees.length / PAGE_SIZE);
  const visibleAttendees = attendees.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );
  const guestCount = attendees.reduce(
    (total, attendee) => total + attendee.guests,
    0,
  );

  return (
    <section aria-labelledby={`${side}-heading`} className="min-w-0">
      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h2
          id={`${side}-heading`}
          className="font-serif text-xl font-semibold sm:text-2xl"
        >
          {sideLabels[side]}
        </h2>
        <p className="text-ink/70 shrink-0 text-sm font-medium">
          <span className="text-green font-serif text-2xl font-bold">
            {guestCount}
          </span>{" "}
          khách
        </p>
      </div>

      <ul className="divide-y divide-[#e3e5d7] overflow-hidden rounded-2xl border border-[#e3e5d7] bg-white">
        {visibleAttendees.length > 0 ? (
          visibleAttendees.map((attendee) => (
            <li
              key={attendee.id}
              className="flex min-h-[55px] items-center justify-between gap-4 px-4 py-3 sm:px-5"
            >
              <span className="text-ink truncate font-semibold">
                {attendee.name}
              </span>
              <span className="text-ink/70 shrink-0 text-sm font-medium">
                {attendee.guests} người
              </span>
            </li>
          ))
        ) : (
          <li className="px-5 py-6 text-center text-sm text-[#747a6b]">
            Chưa có khách xác nhận tham dự
          </li>
        )}
      </ul>

      <nav
        aria-label={`Phân trang ${sideLabels[side]}`}
        className="mt-3 flex items-center justify-center gap-3 text-sm"
      >
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={page === 0}
          className="rounded-xl border border-[#e3e5d7] bg-white px-3 py-2 transition-colors enabled:hover:bg-[#eff3e6] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Trước
        </button>
        <span className="text-ink/70 min-w-20 text-center">
          Trang {page + 1} / {Math.max(pageCount, 1)}
        </span>
        <button
          type="button"
          onClick={() =>
            setPage((current) => Math.min(pageCount - 1, current + 1))
          }
          disabled={page >= pageCount - 1}
          className="rounded-xl border border-[#e3e5d7] bg-white px-3 py-2 transition-colors enabled:hover:bg-[#eff3e6] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Sau
        </button>
      </nav>
    </section>
  );
}

export default function AttendeeDashboard({
  attendees,
}: {
  attendees: Attendee[];
}) {
  const totalGuests = attendees.reduce(
    (total, attendee) => total + attendee.guests,
    0,
  );
  const groomAttendees = attendees.filter(
    (attendee) => attendee.side === "groom",
  );
  const brideAttendees = attendees.filter(
    (attendee) => attendee.side === "bride",
  );

  return (
    <>
      <header className="mb-8 flex flex-col items-center text-center sm:mb-10">
        <div className="flex h-[188px] w-[216px] flex-col items-center justify-end rounded-t-full rounded-b-2xl border border-[#dce5cd] bg-[#e8f0dc] px-4 pb-8">
          <p className="text-green font-serif text-6xl leading-none font-bold">
            {totalGuests}
          </p>
          <p className="text-ink/70 text-sm font-semibold">khách tham dự</p>
        </div>
      </header>

      <div className="grid gap-8 md:grid-cols-2 md:gap-5">
        <AttendeeList side="groom" attendees={groomAttendees} />
        <AttendeeList side="bride" attendees={brideAttendees} />
      </div>
    </>
  );
}
