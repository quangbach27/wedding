import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ASPECTS = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[7/6]",
  square: "aspect-square",
};

type Props = {
  src: string;
  alt: string;
  caption?: ReactNode;
  aspect?: "portrait" | "landscape" | "square";
  priority?: boolean;
  className?: string;
  captionClassName?: string;
  zoom?: number; // 1 = no zoom, 1.5 = 150%
  focus?: string; // transform-origin, e.g. "55% 60%"
};

export default function PhotoCard({
  src,
  alt,
  caption,
  aspect = "portrait",
  priority,
  className,
  captionClassName,
  zoom = 1,
  focus = "50% 50%",
}: Props) {
  return (
    <figure
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl shadow-xl",
        ASPECTS[aspect],
        className,
      )}
    >
      {/* static zoom, aimed at the focus point */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoom})`, transformOrigin: focus }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 28rem, 92vw"
          style={{ objectPosition: focus }}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {caption && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
          <figcaption
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6 text-center",
              captionClassName,
            )}
          >
            {caption}
          </figcaption>
        </>
      )}
    </figure>
  );
}
