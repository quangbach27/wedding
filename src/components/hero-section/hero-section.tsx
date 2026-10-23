import { Section } from "../ui/section";
import WeddingDate from "../ui/wedding-date";
import ArchPhoto from "./arch-photo";
import CoupleName from "./couple-name";
import Typewriter from "./type-writter";

export default function HeroSection() {
  return (
    <Section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-[1fr_auto_1fr] md:gap-12 md:py-20">
      {/* Photo: first on mobile */}
      <ArchPhoto
        src="https://bach-van-wedding.s3.ap-southeast-2.amazonaws.com/hero.jpg"
        alt="Quang Bách và Hồng Vân"
        priority
        className="order-1 mx-auto md:order-2"
      />

      {/* Date, intro line, names */}
      <div className="order-2 text-center md:order-1 md:text-left">
        <WeddingDate />
        <Typewriter
          text="Celebrating khoảnh khắc đặc biệt nhất của chúng tôi"
          className="text-ink/70 mx-auto mt-2 max-w-xs text-base text-balance italic md:mx-0 md:max-w-sm md:text-lg"
        />

        <CoupleName />
      </div>

      {/* Invitation text */}
      <div className="text-ink/70 order-3 mx-auto max-w-md space-y-6 text-center text-base leading-loose md:mx-0 md:max-w-none md:space-y-0 md:text-left md:text-xl">
        <p>
          Cùng với gia đình hai bên, chúng tôi rất mong được chào đón quý khách
          mời tham dự ngày trọng đại nhất của cuộc đời.
        </p>
        <p className="md:mt-6 md:ml-16">
          Sự hiện diện của quý khách sẽ là niềm hạnh phúc lớn lao nhất dành cho
          chúng tôi.
        </p>
      </div>
    </Section>
  );
}
