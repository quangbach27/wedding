"use server";

import { z } from "zod";
import { createRsvpSchema } from "../validation/rsvp";
import { rsvpRepository } from "../repository/rsvp";
import { checkActionRateLimit } from "./rate-limit";

export type RsvpState = {
  errors?: {
    name?: string[];
    attending?: string[];
    guests?: string[];
    side?: string[];
    id?: string[];
  };
  message?: string | null;
  success?: boolean;
  id?: string;
};

const parseRsvp = (formData: FormData) =>
  createRsvpSchema.safeParse({
    name: formData.get("name"),
    attending: formData.get("attending"),
    guests: formData.get("guests") ?? 0,
    side: formData.get("side"),
  });

export async function createRsvp(
  _prevState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  try {
    const rateLimit = await checkActionRateLimit("rsvp", 20, 400);
    if (!rateLimit.ok) {
      return {
        message: `Bạn đã gửi quá nhiều xác nhận. Vui lòng thử lại sau ${rateLimit.retryAfter} giây.`,
      };
    }
  } catch (error) {
    console.error("RSVP rate limit failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  const parsed = parseRsvp(formData);
  if (!parsed.success) {
    return {
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  const { name, attending, guests, side } = parsed.data;

  try {
    const rsvp = await rsvpRepository.create({ name, attending, guests, side });
    return {
      id: rsvp.id,
      success: true,
      message: "Cảm ơn bạn đã xác nhận!",
    };
  } catch (error) {
    console.error("RSVP create failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }
}

export async function updateRsvp(
  _prevState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  try {
    const rateLimit = await checkActionRateLimit("rsvp", 20, 400);
    if (!rateLimit.ok) {
      return {
        message: `Bạn đã gửi quá nhiều xác nhận. Vui lòng thử lại sau ${rateLimit.retryAfter} giây.`,
      };
    }
  } catch (error) {
    console.error("RSVP rate limit failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  const parsed = parseRsvp(formData);
  const id = z
    .string()
    .regex(/^[1-9]\d*$/, "Mã xác nhận không hợp lệ")
    .safeParse(formData.get("id"));

  if (!parsed.success || !id.success) {
    const errors = parsed.success
      ? {}
      : z.flattenError(parsed.error).fieldErrors;
    return {
      errors: {
        ...errors,
        ...(!id.success ? { id: [id.error.issues[0].message] } : {}),
      },
      message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
    };
  }

  try {
    const rsvp = await rsvpRepository.update(id.data, parsed.data);
    if (!rsvp) {
      return {
        message: "Không tìm thấy xác nhận này. Vui lòng tải lại trang.",
      };
    }
    return {
      id: rsvp.id,
      success: true,
      message: "Thông tin tham dự đã được cập nhật!",
    };
  } catch (error) {
    console.error("RSVP update failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }
}
