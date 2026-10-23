"use client";
import { Volume2, VolumeX } from "lucide-react";

import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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
      <audio ref={audioRef} src="/beautiful-in-white.mp3" loop preload="auto" />
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
