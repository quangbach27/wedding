"use client";
import { Volume2, VolumeX } from "lucide-react";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlayback = () => {
      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA || !audio.paused) {
        return;
      }

      audio.play().catch((err: unknown) => {
        if (
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          err.name === "NotAllowedError"
        ) {
          return;
        }
        console.error("Unable to play wedding music:", err);
      });
    };

    const handleUserInteraction = (event: Event) => {
      if (event.isTrusted) attemptPlayback();
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    audio.addEventListener("canplay", attemptPlayback);
    audio.addEventListener("play", removeInteractionListeners, { once: true });
    window.addEventListener("pointerdown", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("wheel", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      audio.removeEventListener("canplay", attemptPlayback);
      audio.removeEventListener("play", removeInteractionListeners);
      removeInteractionListeners();
    };
  }, []);

  const handlePlaying = (e: React.MouseEvent) => {
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((err) => {
          console.error(err);
          setPlaying(false);
        });
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/beautiful-in-white.mp3"
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        onClick={handlePlaying}
        aria-label={playing ? "Mute music" : "Play music"}
        className="border-gold text-gold fixed right-[20] bottom-[20] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-transform hover:scale-105"
      >
        {playing ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
    </>
  );
}
