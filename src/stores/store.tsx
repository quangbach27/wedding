"use client";

import { notFound } from "next/navigation";
import { createContext, useContext, type ReactNode } from "react";

export type Person = {
  displayName?: string;
  fullName: string;
  holyName?: string;
};

type Family = Person & {
  father: Person;
  mother: Person;
  address: string;
};

export type Venue = {
  name: string;
  mapSrc: string;
  redirectMapLink: string;
};

export type StoreType = {
  weddingDate: Date;
  weddingLunarDate: string;
  groom: Family;
  bride: Family;
  weddingVenue: Venue;
  isDisplayHolyName: boolean;
  side: "groom" | "bride";
};

// Fields that differ per side
type SideConfig = Pick<
  StoreType,
  | "weddingVenue"
  | "weddingDate"
  | "weddingLunarDate"
  | "isDisplayHolyName"
  | "side"
>;

const baseStore: Omit<StoreType, keyof SideConfig> = {
  groom: {
    fullName: "Bùi Quang Bách",
    displayName: "Quang Bách",
    holyName: "Phêrô",
    father: { fullName: "Bùi Quang Tân" },
    mother: { fullName: "Nguyễn Thị Phượng" },
    address: "Biên Hòa, Đồng Nai",
  },
  bride: {
    fullName: "Nguyễn Thị Hồng Vân",
    displayName: "Hồng Vân",
    holyName: "Maria",
    father: { fullName: "Nguyễn Văn Năng", holyName: "Martinô" },
    mother: { fullName: "Nguyễn Thị Thay", holyName: "Isave" },
    address: "Tuy Phước, Gia Lai",
  },
};

// Venues: each side can have its own
const goldenLotusVenue: Venue = {
  name: "Sảnh lầu MIMOSA, Nhà hàng tiệc cưới Sen Vàng (Golden Lotus)",
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62675.32459665487!2d106.75301445820311!3d10.947670899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb273dfbf9b%3A0x285b88f5f830de65!2zTmjDoCBIw6BuZyBUaeG7h2MgQ8aw4bubaSBTZW4gVsOgbmcgLSBCacOqbiBIw7Jh!5e0!3m2!1svi!2s!4v1792661751163!5m2!1svi!2s",
  redirectMapLink:
    "https://www.google.com/maps/place/Nh%C3%A0+H%C3%A0ng+Ti%E1%BB%87c+C%C6%B0%E1%BB%9Bi+Sen+V%C3%A0ng+-+Bi%C3%AAn+H%C3%B2a/@10.9476709,106.8204774,17z/data=!3m1!4b1!4m6!3m5!1s0x3174deb273dfbf9b:0x285b88f5f830de65!8m2!3d10.9476709!4d106.8230523!16s%2Fg%2F1hf3z1k7v?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
};

const tanQuanChurchVenue: Venue = {
  name: "Khuôn viên nhà thờ Giáo xứ Tân Quán",
  mapSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.2327483705512!2d109.19913663716248!3d13.82505796820208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6b25dd7451d1%3A0xf0304d0c76bd9af6!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIFTDom4gUXXDoW4!5e0!3m2!1svi!2s!4v1792752017694!5m2!1svi!2s",
  redirectMapLink:
    "https://www.google.com/maps/place/Nh%C3%A0+Th%E1%BB%9D+Gi%C3%A1o+X%E1%BB%A9+T%C3%A2n+Qu%C3%A1n/@13.825058,109.1991366,17z/data=!4m6!3m5!1s0x316f6b25dd7451d1:0xf0304d0c76bd9af6!8m2!3d13.8249583!4d109.2017074!16s%2Fg%2F11ckvlgpnn?entry=ttu&g_ep=EgoyMDI2MTAxOS4wIKXMDSoASAFQAw%3D%3D",
};

const createStore = (config: SideConfig): StoreType => ({
  ...baseStore,
  ...config,
});

export const stores = {
  groom: createStore({
    weddingVenue: goldenLotusVenue,
    weddingDate: new Date("2026-12-06T11:00:00+07:00"),
    weddingLunarDate: "ngày 28 tháng 10 năm Bính Ngọ",
    isDisplayHolyName: false,
    side: "groom",
  }),
  bride: createStore({
    weddingVenue: tanQuanChurchVenue,
    weddingDate: new Date("2026-11-29T11:00:00+07:00"),
    weddingLunarDate: "ngày 21 tháng 10 năm Bính Ngọ",
    isDisplayHolyName: true,
    side: "bride",
  }),
} as const;

export type Side = keyof typeof stores;

export const isSide = (value: string): value is Side =>
  Object.hasOwn(stores, value);

const StoreContext = createContext<StoreType | null>(null);

type StoreProviderProps = {
  side: string;
  children: ReactNode;
};

export const StoreProvider = ({ side, children }: StoreProviderProps) => {
  if (!isSide(side)) {
    notFound();
  }

  return <StoreContext value={stores[side]}>{children}</StoreContext>;
};

export const useStore = (): StoreType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside <StoreProvider>");
  }
  return ctx;
};
