"use server";

import { z } from "zod";
import { wishSchema } from "../validation/wish";
import { wishRepository } from "../repository/wish";
import { checkActionRateLimit } from "./rate-limit";

export type WishState = {
  errors?: {
    name?: string[];
    message?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function createWish(
  _prevState: WishState,
  formData: FormData,
): Promise<WishState> {
  try {
    const rateLimit = await checkActionRateLimit("wish", 20, 400);
    if (!rateLimit.ok) {
      return {
        message: `Bạn đã gửi quá nhiều lời chúc. Vui lòng thử lại sau ${rateLimit.retryAfter} giây.`,
      };
    }
  } catch (error) {
    console.error("Wish rate limit failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt") ?? 0);
  const elapsed = Date.now() - startedAt;
  if (honeypot !== "" || (startedAt > 0 && elapsed >= 0 && elapsed < 3000)) {
    return { success: true }; // pretend success so bots don't adapt
  }

  const parsed = wishSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      message: "Thông tin chưa hợp lệ. Vui lòng kiểm tra lại.",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const { name, message } = parsed.data;

  try {
    await wishRepository.create({ name, message });
  } catch (error) {
    console.error("wish insert failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  // revalidatePath("/[side]", "page"); // refresh the latest-wish banner on next load
  return { success: true };
}
