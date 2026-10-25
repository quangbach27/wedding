"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Start the music on the first click anywhere on the page
  useEffect(() => {
    const start = () => {
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener("click", start, { once: true });
    return () => window.removeEventListener("click", start);
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger the "first click" listener
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/beautiful-in-white.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
        className="border-gold text-gold fixed right-5 bottom-5 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-transform hover:scale-105"
      >
        {playing ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
    </>
  );
}
