"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import WishForm from "./wish-form";

export default function WishModal({ trigger }: { trigger: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  const handleSuccess = useCallback(() => {
    closeModal();
    window.dispatchEvent(new Event("wishes:changed"));
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        aria-haspopup="dialog"
        className="bg-green hover:bg-green/90 focus-visible:outline-gold-dark mt-2 md:mt-7 flex w-full max-w-md cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold tracking-[0.16em] text-white uppercase shadow-lg shadow-green/20 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {trigger}
      </button>

      <dialog
        ref={dialogRef}
        className="wish-dialog fixed inset-x-0 top-auto bottom-0 m-0 max-h-[min(90dvh,42rem)] w-full max-w-none overflow-y-auto rounded-t-3xl border-0 bg-[#fffdf5] p-0 text-ink shadow-2xl backdrop:bg-ink/55 backdrop:backdrop-blur-[2px] sm:inset-y-1/2 sm:bottom-auto sm:left-1/2 sm:right-auto sm:max-h-[calc(100dvh-3rem)] sm:w-[calc(100%-2rem)] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
        aria-labelledby="wish-modal-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}
      >
        <div className="px-5 pt-2 pb-6 sm:px-7 sm:pt-5">
          <div
            aria-hidden="true"
            className="mx-auto mb-3 h-1.5 w-9 rounded-full bg-gold-light sm:hidden"
          />
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="wish-modal-title"
              className="text-green font-script text-3xl font-bold"
            >
              Viết lời chúc
            </h2>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Đóng biểu mẫu lời chúc"
              className="bg-cream text-ink hover:bg-gold-light/40 focus-visible:outline-gold-dark flex size-10 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <WishForm
            hideWishesLink
            onSuccess={handleSuccess}
            className="gap-3 rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none md:gap-4 md:p-0"
          />
        </div>
      </dialog>
    </>
  );
}
