"use client";

import { useReducer, useState } from "react";
import { CalendarDays, Check, Heart, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { empty, initStore, reducer } from "./store";

const EVENT = {
  time: "18:00, Chủ Nhật, 06/12/2026",
  place: "Nhà hàng tiệc cưới Sen Vàng - Biên Hòa",
};

export default function RsvpForm({ className }: { className?: string }) {
  const [store, set] = useReducer(reducer, empty, initStore);
  const { name, choice, submitted, isLoading, error } = store;

  // Only the "are you sure?" step stays outside the store
  const [isConfirming, setIsConfirming] = useState(false);

  const canSubmit = name.trim() !== "" && choice !== null && !isLoading;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
  }

  async function withdraw() {
    set({ isLoading: true, error: null });
  }

  const cardClass = cn(
    "border-gold-light/60 w-full rounded-2xl border bg-white/70 p-5 shadow-[0_16px_40px_-20px_rgba(47,61,34,0.25)] backdrop-blur-sm md:p-8",
    className,
  );

  /* ---------- Already answered ---------- */
  if (submitted) {
    const attending = choice === "yes";

    return (
      <div
        className={cn(
          cardClass,
          "flex flex-col items-center py-8 text-center md:py-10",
        )}
      >
        <Heart
          size={30}
          fill="currentColor"
          strokeWidth={0}
          className="text-gold"
        />
        <p className="text-ink mt-3 font-serif text-2xl italic md:text-3xl">
          Cảm ơn {name}!
        </p>

        {attending ? (
          <>
            <span className="bg-green/10 text-green mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold md:text-base">
              <Check size={16} strokeWidth={3} />
              Bạn đã xác nhận tham dự
            </span>

            <ul className="text-ink/80 mt-5 w-full max-w-sm space-y-3 text-left text-base md:text-lg">
              <li className="flex items-start gap-3">
                <CalendarDays size={20} className="text-gold mt-1 shrink-0" />
                <span>{EVENT.time}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gold mt-1 shrink-0" />
                <span>{EVENT.place}</span>
              </li>
            </ul>

            <p className="text-ink/70 mt-5 text-base md:text-lg">
              Chúng mình rất mong được gặp bạn trong ngày trọng đại.
            </p>
          </>
        ) : (
          <p className="text-ink/70 mt-2 text-base md:text-lg">
            Chúng mình rất tiếc vì bạn không thể đến, cảm ơn bạn đã phản hồi.
          </p>
        )}

        <div className="border-gold-light/60 mt-6 w-full max-w-sm border-t pt-5">
          {isConfirming ? (
            <div
              role="alertdialog"
              aria-label="Xác nhận thu hồi"
              className="space-y-3"
            >
              <p className="text-ink text-base font-semibold">
                Bạn chắc chắn muốn thu hồi lời tham dự?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={isLoading}
                  className="border-lime/60 text-ink hover:border-green rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 md:text-base"
                >
                  Giữ lại
                </button>
                <button
                  type="button"
                  onClick={withdraw}
                  disabled={isLoading}
                  className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-40 md:text-base"
                >
                  {isLoading ? "Đang xử lý..." : "Thu hồi"}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                set({ error: null });
                if (attending) setIsConfirming(true);
                else withdraw();
              }}
              disabled={isLoading}
              className="text-ink/60 hover:text-ink text-sm underline underline-offset-4 transition disabled:opacity-40 md:text-base"
            >
              {attending ? "Thu hồi lời tham dự" : "Đổi câu trả lời"}
            </button>
          )}

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600 md:text-base">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <form onSubmit={submit} className={cn(cardClass, "space-y-3 md:space-y-4")}>
      <input
        type="text"
        value={name}
        onChange={(e) => set({ name: e.target.value })}
        placeholder="Tên của bạn"
        maxLength={80}
        autoComplete="name"
        aria-label="Tên của bạn"
        className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
      />

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        <legend className="sr-only">Bạn có tham dự không?</legend>
        {(
          [
            ["yes", "Sẽ tham dự"],
            ["no", "Không thể tham dự"],
          ] as const
        ).map(([value, label]) => (
          <label key={value} className="cursor-pointer">
            <input
              type="radio"
              name="attending"
              value={value}
              checked={choice === value}
              onChange={() => set({ choice: value })}
              className="peer sr-only"
            />
            <span
              className={cn(
                "border-lime/60 text-ink flex items-center justify-center rounded-xl border-2 bg-white/60 px-3 py-3 text-center text-base font-semibold transition md:text-xl",
                "hover:border-green peer-checked:border-green peer-checked:bg-green peer-checked:text-white",
                "peer-focus-visible:ring-green/30 peer-focus-visible:ring-4",
              )}
            >
              {label}
            </span>
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={!canSubmit}
        className="bg-green hover:bg-green/90 w-full rounded-lg px-5 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase transition disabled:cursor-not-allowed disabled:opacity-40 md:text-base"
      >
        {isLoading ? "Đang gửi..." : "Gửi xác nhận"}
      </button>

      {error && (
        <p
          role="alert"
          className="text-center text-sm text-red-600 md:text-base"
        >
          {error}
        </p>
      )}
    </form>
  );
}
