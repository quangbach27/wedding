"use client";

import { Check } from "lucide-react";
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
  const { side } = useStore();
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

  /* ---------- Success ---------- */
  if (confirmed) {
    const attending = submitted?.attending !== "no";

    return (
      <div
        role="status"
        className={cn(
          cardClass,
          "text-ink flex flex-col items-center gap-4 py-10 text-center md:py-12",
          "transition duration-500 starting:translate-y-2 starting:opacity-0",
        )}
      >
        <span className="bg-green flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg">
          <Check size={32} strokeWidth={3} />
        </span>

        <h3 className="font-(family-name:--font-dancing) text-3xl md:text-4xl">
          {submitted?.name ? `Cảm ơn ${submitted.name}!` : "Cảm ơn bạn!"}
        </h3>

        <p className="text-ink/80 max-w-md text-base md:text-lg">
          {attending
            ? "Chúng tôi rất hân hạnh được đón tiếp bạn trong ngày trọng đại của mình."
            : "Rất tiếc bạn không thể đến, nhưng chúng tôi vô cùng trân trọng tình cảm của bạn."}
        </p>

        {attending && submitted && (
          <div className="border-lime/60 rounded-full border-2 bg-white/60 px-5 py-2 text-base font-semibold md:text-lg">
            Số người tham dự: {submitted.guests}
          </div>
        )}

        <button
          type="button"
          onClick={handleEdit}
          className="text-ink/60 hover:text-ink text-sm underline underline-offset-4 transition"
        >
          Chỉnh sửa
        </button>
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
