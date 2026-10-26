"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 30_000);
  return () => window.clearInterval(id);
}
const getNow = () => Math.floor(Date.now() / 30_000) * 30_000;
const getServerNow = () => 0; // avoids hydration mismatch

export const useNow = () =>
  useSyncExternalStore(subscribe, getNow, getServerNow);

export function formatRelative(iso: string, now: number) {
  if (!now) return "";
  const sec = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (sec < 60) return "vừa xong";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  return day === 1 ? "Hôm qua" : `${day} ngày trước`;
}
