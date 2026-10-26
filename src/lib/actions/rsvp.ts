"use server";

import { z } from "zod";
import { createRsvpSchema } from "../validation/rsvp";
import { sql } from "../db";
import { rsvpRepository } from "../repository/rsvp";

export type RsvpState = {
  errors?: {
    name?: string[];
    attending?: string[];
    guests?: string[];
    side?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createRsvp(
  _prevState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const parsed = createRsvpSchema.safeParse({
    name: formData.get("name"),
    attending: formData.get("attending"),
    guests: formData.get("guests") ?? 0,
    side: formData.get("side"),
  });

  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  const { name, attending, guests, side } = parsed.data;

  try {
    await rsvpRepository.upsert({ name, attending, guests, side });
  } catch (error) {
    console.error("RSVP insert failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  return { success: true, message: "Cảm ơn bạn đã xác nhận!" };
}
