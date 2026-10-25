import { z } from "zod";

export const createRsvpSchema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập tên").max(100, "Tên quá dài"),
    attending: z.enum(["yes", "no"]).transform((v) => v === "yes"),
    guests: z.coerce.number().int().min(0).max(10),
    side: z.enum(["bride", "groom"]),
  })
  .refine((d) => (d.attending ? d.guests >= 1 : d.guests === 0), {
    message: "Số người tham dự không hợp lệ",
    path: ["guests"],
  });
