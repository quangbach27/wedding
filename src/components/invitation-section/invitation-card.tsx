"use client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useStore } from "../../stores/store";

type NameParts = {
  fullName: string;
  holyName?: string;
  isDisplayHolyName: boolean;
};

export const generateName = ({
  fullName,
  holyName,
  isDisplayHolyName,
}: NameParts): string =>
  isDisplayHolyName && holyName ? `${holyName} ${fullName}` : fullName;

type Family = {
  title: string; // "Nhà trai" | "Nhà gái"
  lines: string[];
};

type Props = {
  className?: string;
};

function FamilyBlock({ family }: { family: Family }) {
  return (
    <div>
      <h3 className="text-gold text-sm font-bold tracking-[0.35em] uppercase md:text-lg">
        {family.title}
      </h3>
      <div className="text-ink/70 mt-3 space-y-1 text-xs leading-relaxed md:mt-2 md:text-sm">
        {family.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default function InvitationCard({ className }: Props) {
  const { groom, bride, isDisplayHolyName } = useStore();

  return (
    <section
      className={cn(
        "border-gold relative mx-auto w-full max-w-5xl rounded-2xl border bg-white/70 p-2 shadow-sm backdrop-blur-sm md:p-3",
        className,
      )}
    >
      <div className="border-gold-light/80 border px-5 py-5 md:px-10 md:py-10">
        {/* Hai họ */}
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:justify-between md:gap-10 md:text-left">
          <FamilyBlock
            family={{
              title: "Nhà Trai",
              lines: [
                `Phụ thân: ${generateName({
                  fullName: groom.father.fullName,
                  holyName: groom.father.holyName,
                  isDisplayHolyName,
                })}`,

                `Phụ mẫu: ${generateName({
                  fullName: groom.mother.fullName,
                  holyName: groom.mother.holyName,
                  isDisplayHolyName,
                })}`,
                groom.address,
              ],
            }}
          />
          <div className="hidden h-full flex-col items-center justify-start gap-3 pt-1 md:flex">
            <span className="bg-gold-light h-8 w-px md:h-12" />
            <Heart
              size={20}
              fill="currentColor"
              strokeWidth={0}
              className="text-gold"
            />
            <span className="bg-gold-light h-8 w-px md:h-12" />
          </div>
          <FamilyBlock
            family={{
              title: "Nhà Gái",
              lines: [
                `Phụ thân: ${generateName({
                  fullName: bride.father.fullName,
                  holyName: bride.father.holyName,
                  isDisplayHolyName,
                })}`,

                `Phụ mẫu: ${generateName({
                  fullName: bride.mother.fullName,
                  holyName: bride.mother.holyName,
                  isDisplayHolyName,
                })}`,
                bride.address,
              ],
            }}
          />
        </div>

        {/* Tên cô dâu chú rể */}
        <div className="mt-6 flex flex-col items-center text-center md:mt-8">
          <p className="text-ink/60 mb-4 text-xs font-semibold tracking-[0.3em] uppercase md:text-sm">
            Trân trọng báo tin lễ thành hôn
          </p>

          <h2 className="font-script text-ink text-3xl leading-tight md:text-6xl">
            {generateName({
              fullName: groom.fullName,
              holyName: groom.holyName,
              isDisplayHolyName,
            })}
          </h2>

          <span className="font-script text-gold -my-1 text-3xl md:text-5xl">
            &amp;
          </span>

          <h2 className="font-script text-ink text-3xl leading-tight md:text-6xl">
            {generateName({
              fullName: bride.fullName,
              holyName: bride.holyName,
              isDisplayHolyName,
            })}
          </h2>

          <span className="bg-gold-light mt-6 block h-px w-20 md:w-28" />

          <p className="text-ink mt-4 max-w-xl font-serif text-sm italic md:text-lg">
            Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi
          </p>
        </div>
      </div>
    </section>
  );
}
