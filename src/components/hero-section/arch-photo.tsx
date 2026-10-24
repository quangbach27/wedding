import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  preload?: boolean;
  className?: string;
};

export default function ArchPhoto({ src, alt, preload, className }: Props) {
  return (
    <div className={cn("relative aspect-3/4 w-70 md:w-md", className)}>
      <div
        aria-hidden
        className="bg-mint/40 absolute inset-x-6 top-10 -bottom-4 -z-10 rounded-t-full blur-3xl"
      />

      <div className="ring-gold-light/40 relative h-full w-full overflow-hidden rounded-t-full shadow-[0_30px_60px_-25px_rgba(47,61,34,0.35)] ring-1">
        <Image
          src={src}
          alt={alt}
          fill
          preload={preload}
          sizes="(min-width: 768px) 448px, 280px"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
