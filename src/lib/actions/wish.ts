"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { wishSchema } from "../validation/wish";
import { sql } from "../db";
import { wishRepository } from "../repository/wish";

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
