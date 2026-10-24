import type { Metadata } from "next";
import {
  Dancing_Script,
  Cormorant_Garamond,
  Quicksand,
} from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/music-player/music-player";

const dancing = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  variable: "--font-dancing",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Quang Bách & Hồng Vân Wedding",
  description: "Trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi.",
  openGraph: {
    title: "Quang Bách & Hồng Vân Wedding",
    description: "Thư mời cưới ngày 29/11/2026",
    images: ["/hero.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${dancing.variable} ${cormorant.variable} ${quicksand.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <MusicPlayer />
        {children}
      </body>
    </html>
  );
}
