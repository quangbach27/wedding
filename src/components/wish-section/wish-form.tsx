"use client";

import { createWish } from "@/lib/actions/wish";
import { cn } from "@/lib/utils";
import { ArrowDown, Check, LoaderCircle, Send } from "lucide-react";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import ViewWishesButton from "./view-wish-button";
import Link from "next/link";

export default function WishForm({
  className,
  hideWishesLink = false,
  onSuccess,
}: {
  className?: string;
  hideWishesLink?: boolean;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(createWish, {});
  const [startedAt, setStartedAt] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuccess(false);

    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartedAt(Date.now());
  }, []);

  useEffect(() => {
    if (!state.success) return;

    const timeout = window.setTimeout(() => {
      formRef.current?.reset();
      setShowSuccess(true);
      onSuccess?.();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [state, onSuccess]);

  const cardClass = cn(
    "relative border-gold-light/60 w-full rounded-2xl border bg-white/70 p-5 shadow-[0_16px_40px_-20px_rgba(47,61,34,0.25)] backdrop-blur-sm md:p-8",
    className,
  );
  return (
    <form
      ref={formRef}
      className={cn("flex flex-col gap-3 md:gap-4", cardClass)}
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* honeypot */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {showSuccess && (
        <div className="wish-success-enter flex flex-col items-center gap-4 py-6 text-center">
          <span className="bg-green/10 text-green ring-green/20 flex size-14 items-center justify-center rounded-full ring-1">
            <Check aria-hidden="true" className="size-7" strokeWidth={2.5} />
          </span>
          <div role="status">
            <p className="text-ink text-lg font-semibold">
              Cảm ơn bạn đã gửi lời chúc!
            </p>
            <p className="text-ink/70 mt-1 text-sm leading-relaxed">
              Lời chúc yêu thương của bạn đã được gửi đến cô dâu và chú rể.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="text-green hover:bg-green/5 focus-visible:outline-gold-dark border-green/30 rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Gửi lời chúc khác
          </button>
        </div>
      )}
      {!showSuccess && (
        <>
          <div>
            <input
              type="text"
              placeholder="Tên của bạn"
              required
              name="name"
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Vui lòng nhập tên của bạn")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              autoComplete="name"
              aria-label="Tên của bạn"
              className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
            />
            {state.errors?.name && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.name[0]}
              </p>
            )}
          </div>
          <div>
            <textarea
              placeholder="Lời Chúc"
              name="message"
              autoComplete="message"
              required
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Vui lòng nhập Lời Chúc Phúc")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
              aria-label="Lời chúc"
              rows={4}
              className="border-lime/60 text-ink placeholder:text-ink/40 focus:border-green focus:ring-green/20 w-full rounded-xl border-2 bg-white/60 px-4 py-3 text-base transition outline-none focus:ring-4 md:px-5 md:text-xl"
            />
            {state.errors?.message && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.message[0]}
              </p>
            )}
          </div>
          {state.message && !state.success && (
            <p role="alert" className="text-center text-sm text-red-600">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="bg-green hover:bg-green/90 focus-visible:outline-gold-dark flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase shadow-sm transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
          >
            {pending ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4.5 animate-spin"
              />
            ) : (
              <Send aria-hidden="true" size={18} />
            )}
            {pending ? "Đang gửi lời chúc..." : "Gửi lời chúc"}
          </button>
        </>
      )}

      <Link
        href="/wishes"
        className="group text-ink decoration-ink/35 hover:decoration-ink relative z-10 mx-auto mt-2 flex w-fit items-center gap-1 py-2 text-[13px] font-medium underline underline-offset-4 transition"
      >
        Xem sổ lưu bút
        <ArrowDown
          aria-hidden
          className="size-3.5 transition-transform duration-300 motion-safe:group-hover:translate-y-0.5"
        />
      </Link>
    </form>
  );
}
