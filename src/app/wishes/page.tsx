import { Suspense } from "react";
import { Heart, PenLine } from "lucide-react";
import { wishRepository } from "@/lib/repository/wish";
import { SectionHeading } from "@/components/ui/section-heading";
import WishModal from "@/components/wish-section/wish-modal";
import WishWallList from "@/components/wish-section/wish-wall";

async function WishWall() {
  const initialPage = await wishRepository.list({ limit: 11 });
  return <WishWallList initialPage={initialPage} />;
}

function WishWallFallback() {
  return (
    <div
      className="min-h-0 flex-1 space-y-3 overflow-y-auto"
      aria-label="Đang tải lời chúc"
      aria-busy="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="border-gold-light/40 h-28 animate-pulse rounded-2xl border bg-white/60"
        />
      ))}
    </div>
  );
}

export default function WishesPage() {
  return (
    <main className="h-dvh overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
      <div className="border-gold-light/50 mx-auto grid h-full min-h-0 max-w-6xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-2xl border bg-linear-to-br from-[#f7f8e9] via-[#fbfaf3] to-[#f5f0df] shadow-[0_18px_55px_-32px_rgba(47,61,34,0.45)] md:grid-cols-2 md:grid-rows-1">
        <section className="flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-8 md:min-h-0 md:px-12 md:py-10 lg:px-16">
          <div className="max-w-lg">
            <span className="text-gold-dark inline-flex items-center gap-2 rounded-full border border-gold-light/60 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide">
              <Heart aria-hidden="true" className="size-3.5 fill-current" />
              Sổ lưu bút
            </span>
            <h1 className="text-green mt-5 font-script text-5xl leading-tight font-bold sm:text-6xl lg:text-7xl">
              Lời chúc phúc
            </h1>
            <p className="text-ink/75 mt-4 max-w-md text-sm leading-relaxed sm:text-base">
              Gửi đến cô dâu và chú rể những lời yêu thương, để lại dấu ấn
              trong ngày trọng đại của chúng tôi.
            </p>

            <WishModal
              trigger={
                <>
                  <PenLine aria-hidden="true" className="size-4" />
                  Viết lời chúc
                </>
              }
            />
          </div>
        </section>

        <section
          id="wish-list"
          aria-label="Lời chúc yêu thương"
          className="border-gold-light/40 flex min-h-0 flex-col overflow-hidden border-t px-5 py-5 sm:px-8 md:border-t-0 md:border-l md:px-8 md:py-8 lg:px-12"
        >
          <SectionHeading
            title="Lời chúc yêu thương"
            subtitle="Từ gia đình và bạn bè"
            className="mb-4 shrink-0 items-start text-left"
          />
          <div className="flex min-h-0 flex-1 flex-col">
            <Suspense fallback={<WishWallFallback />}>
              <WishWall />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}