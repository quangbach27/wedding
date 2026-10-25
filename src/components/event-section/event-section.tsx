"use client";
import { useStore } from "@/stores/store";
import PhotoCard from "../ui/photo-card";
import { Section, type SectionReveal } from "../ui/section";
import { SectionHeading } from "../ui/section-heading";
import EventCalendar from "./event-calendar";
import { parseDatePart } from "@/lib/date";

export default function EventSection({ reveal }: { reveal?: SectionReveal }) {
  const { weddingDate, side } = useStore();
  const { time, weekday } = parseDatePart(weddingDate);

  return (
    <Section reveal={reveal}>
      <SectionHeading
        eyebrow="Ngày trọng đại"
        title={`Thân mời quý khách đến dự lễ ${side == "groom" ? "Thành Hôn" : "Vu Quy"}`}
        subtitle={`Được tổ chức vào lúc ${time}, ${weekday}`}
      />

      <div className="flex flex-col items-center gap-5 md:flex-row">
        <EventCalendar className="md:order-2" />
        <PhotoCard
          src="/groom.webp"
          alt="Ảnh Chú Rể"
          aspect="portrait"
          className="max-w-70 md:order-1"
          zoom={1}
          focus="50% 0%"
          caption={
            <>
              <span className="text-gold text-xs font-semibold tracking-[0.35em] uppercase md:text-sm">
                Chú rể
              </span>
              <span className="font-script mt-1 text-3xl leading-tight text-white drop-shadow md:text-4xl">
                Quang Bách
              </span>
              <span className="mt-1 text-sm tracking-widest text-white/80">
                Út nam
              </span>
            </>
          }
        />
        <PhotoCard
          src="/bride.webp"
          alt="Ảnh Cô dâu"
          aspect="portrait"
          className="w-full max-w-70 md:order-3"
          zoom={1.2}
          caption={
            <>
              <span className="text-gold text-xs font-semibold tracking-[0.35em] uppercase md:text-sm">
                Cô dâu
              </span>
              <span className="font-script mt-1 text-3xl leading-tight text-white drop-shadow md:text-4xl">
                Hồng Vân
              </span>
              <span className="mt-1 text-sm tracking-widest text-white/80">
                Út nữ
              </span>
            </>
          }
        />
      </div>
    </Section>
  );
}
