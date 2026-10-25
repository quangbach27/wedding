"use client";

import { CalendarPlus, Check, Heart, Pencil, Users } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { createRsvp } from "@/lib/actions/rsvp";
import { useStore } from "@/stores/store";

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

type Submitted = { name: string; attending: "yes" | "no"; guests: number };

const clamp = (n: number) =>
  Number.isNaN(n)
    ? MIN_GUESTS
    : Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, Math.trunc(n)));

export default function RsvpForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState(createRsvp, {});
  const { side, weddingDate } = useStore();
  const storageKey = `rsvp:${side}`;

  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [ready, setReady] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState<Submitted | null>(null);

  const guestsRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<Submitted | null>(null);

  // Client-only values, so server and client HTML match
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartedAt(Date.now());
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Submitted;
        setSubmitted(saved);
        setChoice(saved.attending);
        setConfirmed(true);
      }
    } catch {
      // storage can be blocked (private mode, in-app browsers)
    }
    setReady(true);
  }, [storageKey]);

  // When the server confirms, show the thank-you card and remember it
  useEffect(() => {
    if (!state.success || !pendingRef.current) return;
    const saved = pendingRef.current;
    setSubmitted(saved);
    setConfirmed(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch {}
  }, [state, storageKey]);

  const changeGuests = (delta: number) => {
    const el = guestsRef.current;
    if (!el) return;
    el.value = String(clamp(Number(el.value) + delta));
    el.setCustomValidity("");
  };

  // Submit through a transition instead of <form action>, so React does NOT
  // reset the fields when the server returns an error.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (choice === null) return;

    const data = new FormData(e.currentTarget);

    pendingRef.current = {
      name: String(data.get("name") ?? "").trim(),
      attending: choice,
      guests: choice === "yes" ? clamp(Number(data.get("guests") ?? 1)) : 0,
    };

    startTransition(() => formAction(data));
  };

  const handleEdit = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setConfirmed(false);
  };

  const cardClass = cn(
    "relative border-gold-light/60 w-full rounded-2xl border bg-white/70 p-5 shadow-[0_16px_40px_-20px_rgba(47,61,34,0.25)] backdrop-blur-sm md:p-8",
    className,
  );

  const stepButton =
    "border-lime/60 text-ink hover:border-green flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white/60 text-xl transition";

  /* ---------- Placeholder until storage is read (avoids a flash) ---------- */
  if (!ready) {
    return <div aria-hidden className={cardClass} style={{ minHeight: 260 }} />;
  }

  if (confirmed) {
    const attending = submitted?.attending !== "no";

    const fmt = (o: Intl.DateTimeFormatOptions) =>
      weddingDate.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        ...o,
      });

    const dateText = fmt({
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeText = fmt({ hour: "2-digit", minute: "2-digit" });

    // Link Google Calendar (sự kiện kéo dài 3 giờ)
    const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const calendarUrl = weddingDate
      ? "https://calendar.google.com/calendar/render?" +
        new URLSearchParams({
          action: "TEMPLATE",
          text: "Đám cưới Quang Bách & Hồng Vân",
          dates: `${stamp(weddingDate)}/${stamp(new Date(weddingDate.getTime() + 3 * 3600_000))}`,
        })
      : null;

    return (
      <div
        role="status"
        className={cn(
          cardClass,
          "text-ink flex flex-col items-center gap-5 overflow-hidden py-10 text-center md:py-12",
          "bg-[radial-gradient(ellipse_at_top,rgba(98,168,70,0.14),transparent_60%)]",
          "transition duration-500 starting:translate-y-2 starting:opacity-0",
        )}
      >
        {/* Badge */}
        <span className="relative flex h-16 w-16 items-center justify-center">
          <span
            aria-hidden
            className="bg-green/30 absolute inset-0 animate-ping rounded-full [animation-iteration-count:2] motion-reduce:hidden"
          />
          <span
            className={cn(
              "relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg",
              attending ? "bg-green" : "bg-gold",
            )}
          >
            {attending ? (
              <Check size={32} strokeWidth={3} />
            ) : (
              <Heart size={30} fill="currentColor" />
            )}
          </span>
        </span>

        <div className="space-y-2">
          <h3 className="font-(family-name:--font-dancing) text-3xl md:text-4xl">
            {submitted?.name ? `Cảm ơn ${submitted.name}!` : "Cảm ơn bạn!"}
          </h3>
          <p className="text-ink/80 mx-auto max-w-md text-base md:text-lg">
            {attending
              ? "Chúng tôi rất hân hạnh được đón tiếp bạn."
              : "Rất tiếc bạn không thể đến, nhưng chúng tôi vô cùng trân trọng tình cảm của bạn."}
          </p>
        </div>

        {/* Tóm tắt */}
        {attending && submitted && (
          <dl className="border-lime/60 divide-lime/40 grid w-full max-w-md grid-cols-2 divide-x rounded-2xl border-2 bg-white/70 text-left">
            <div className="space-y-1 p-4">
              <dt className="text-ink/60 flex items-center gap-1.5 text-xs tracking-wide uppercase">
                <Users size={14} aria-hidden /> Số người
              </dt>
              <dd className="text-xl font-semibold">{submitted.guests}</dd>
            </div>
            {dateText && (
              <div className="space-y-1 p-4">
                <dt className="text-ink/60 flex items-center gap-1.5 text-xs tracking-wide uppercase">
                  <CalendarPlus size={14} aria-hidden /> Thời gian
                </dt>
                <dd className="text-base leading-snug font-semibold">
                  <span className="capitalize">{dateText}</span>
                  <span className="text-ink/70 block text-sm font-medium">
                    {timeText}
                  </span>
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Hành động */}
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          {attending && calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green hover:bg-green/90 flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold tracking-widest text-white uppercase transition"
            >
              <CalendarPlus size={18} aria-hidden /> Thêm vào lịch
            </a>
          )}
          <button
            type="button"
            onClick={handleEdit}
            className="border-lime/60 text-ink hover:border-green flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border-2 bg-white/60 px-5 text-sm font-semibold transition"
          >
            <Pencil size={16} aria-hidden /> Chỉnh sửa
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Form ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(cardClass, "space-y-3 md:space-y-4")}
    >
      <input type="hidden" name="side" value={side} />
      <input type="hidden" name="startedAt" value={startedAt} />

      {/* honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div>
        <input
          type="text"
          name="name"
          required
          defaultValue={submitted?.name}
          placeholder="Tên của quý khách"
          maxLength={80}
          autoComplete="name"
          aria-label="Tên của bạn"
          aria-invalid={!!state.errors?.name}
          onInvalid={(e) =>
            e.currentTarget.setCustomValidity("Vui lòng nhập tên của bạn")
          }
          onInput={(e) => e.currentTarget.setCustomValidity("")}
          className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
        />
        {state.errors?.name && (
          <p className="mt-1 text-sm text-red-600">{state.errors.name[0]}</p>
        )}
      </div>

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
              required
              checked={choice === value}
              onChange={() => setChoice(value)}
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
      {state.errors?.attending && (
        <p className="text-sm text-red-600">{state.errors.attending[0]}</p>
      )}

      {/* Guest count: only shown when attending */}
      {choice === "yes" && (
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="guests" className="text-ink text-base md:text-xl">
            Số người tham dự
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Giảm số người"
              onClick={() => changeGuests(-1)}
              className={stepButton}
            >
              −
            </button>

            <input
              ref={guestsRef}
              id="guests"
              name="guests"
              type="number"
              inputMode="numeric"
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              defaultValue={
                submitted && submitted.guests >= MIN_GUESTS
                  ? submitted.guests
                  : MIN_GUESTS
              }
              onBlur={(e) => {
                e.currentTarget.value = String(
                  clamp(Number(e.currentTarget.value)),
                );
              }}
              onInvalid={(e) => {
                const el = e.currentTarget;
                if (el.validity.rangeOverflow) {
                  el.setCustomValidity(`Tối đa ${MAX_GUESTS} người`);
                } else if (
                  el.validity.rangeUnderflow ||
                  el.validity.valueMissing
                ) {
                  el.setCustomValidity(
                    `Vui lòng nhập ít nhất ${MIN_GUESTS} người`,
                  );
                } else {
                  el.setCustomValidity("Vui lòng nhập số hợp lệ");
                }
              }}
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              className="text-ink w-12 [appearance:textfield] bg-transparent text-center text-xl font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              type="button"
              aria-label="Tăng số người"
              onClick={() => changeGuests(1)}
              className={stepButton}
            >
              +
            </button>
          </div>
        </div>
      )}
      {state.errors?.guests && (
        <p className="text-sm text-red-600">{state.errors.guests[0]}</p>
      )}

      {/* `side` has no visible field, so surface its error to catch config problems */}
      {state.errors?.side && (
        <p className="text-sm text-red-600">
          Không xác định được thiệp mời ({state.errors.side[0]})
        </p>
      )}

      {/* Server error (validation or database) */}
      {state.message && !state.success && (
        <p role="alert" className="text-center text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-green hover:bg-green/90 w-full rounded-lg px-5 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase transition disabled:cursor-not-allowed disabled:opacity-40 md:text-base"
      >
        {pending ? "Đang gửi..." : "Gửi xác nhận"}
      </button>
    </form>
  );
}
