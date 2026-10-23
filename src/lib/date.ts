const TZ = "Asia/Ho_Chi_Minh";

const formatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TZ,
  weekday: "long",
  day: "2-digit",
  month: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23", // avoids "24:00" at midnight
});

export const parseDatePart = (date: Date) => {
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value }) => [type, value]),
  );

  return {
    day: parts.day, // "06", "29"
    month: parts.month, // "11" (1-based)
    year: parts.year, // "2026"
    time: `${parts.hour}:${parts.minute}`, // "11:00"
    weekday: parts.weekday, // "Chủ Nhật"
  };
};
