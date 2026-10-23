"use client";

import { useStore } from "../../stores/store";

export default function CoupleName() {
  const { groom, bride } = useStore();

  return (
    <div className="text-ink mt-6 flex flex-wrap items-baseline justify-center gap-x-3 font-serif text-3xl font-medium md:mt-12 md:block md:text-5xl md:leading-[1.1]">
      <span className="md:block">{groom.displayName || groom.fullName}</span>
      <span className="text-gold font-script text-3xl italic md:ml-14 md:block md:text-6xl">
        &amp;
      </span>
      <span className="md:ml-20 md:block">
        {bride.displayName || bride.fullName}
      </span>
    </div>
  );
}
