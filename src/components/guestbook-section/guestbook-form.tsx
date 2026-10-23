import { cn } from "@/lib/utils";

export default function GuestbookForm({ className }: { className?: string }) {
  return (
    <form className={cn("flex flex-col gap-3 md:gap-4", className)}>
      <input
        type="text"
        placeholder="Tên của bạn"
        autoComplete="name"
        aria-label="Tên của bạn"
        className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
      />

      <textarea
        placeholder="Lời Chúc"
        autoComplete="name"
        aria-label="Tên của bạn"
        rows={4}
        className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
      />

      <button
        type="submit"
        className="bg-green hover:bg-green/90 ml-auto rounded-lg px-5 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase transition disabled:cursor-not-allowed disabled:opacity-40 md:text-base"
      >
        Gửi lời chúc
      </button>
    </form>
  );
}
