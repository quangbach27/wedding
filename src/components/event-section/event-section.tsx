import PhotoCard from "../ui/photo-card";
import { Section, SectionHeading } from "../ui/section";
import EventCalendar from "./event-calendar";

export default function EventSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Ngày trọng đại"
        title="Thân mời quý khách đến dự lễ Thành hôn"
        subtitle="Được tổ chức vào lúc 11:00, Chủ Nhật"
      />

      <div className="flex flex-col items-center gap-5 md:flex-row">
        <EventCalendar className="md:order-2" />
        <PhotoCard
          src="https://bach-van-wedding.s3.ap-southeast-2.amazonaws.com/groom.JPG"
          alt="Ảnh Chú Rể"
          aspect="portrait"
          className="w-70 md:order-1 md:w-60"
          zoom={1}
          focus="50% 0%"
          caption={
            <>
              <span className="text-gold-light text-xs font-semibold tracking-[0.35em] uppercase md:text-sm">
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
          src="https://bach-van-wedding.s3.ap-southeast-2.amazonaws.com/bride.JPG"
          alt="Ảnh Cô dâu"
          aspect="portrait"
          className="w-70 md:order-3 md:w-60"
          focus="50% 0%"
          caption={
            <>
              <span className="text-gold-light text-xs font-semibold tracking-[0.35em] uppercase md:text-sm">
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
