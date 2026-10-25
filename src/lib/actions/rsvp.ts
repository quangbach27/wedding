"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { createRsvpSchema } from "../validation/rsvp";

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

const sql = neon(process.env.DATABASE_URL!);

const IP_LIMIT = 10; // max RSVPs per IP...
const IP_WINDOW_MIN = 10; // ...within this many minutes
const GLOBAL_LIMIT = 300; // safety net for distributed bots, per hour

export async function createRsvp(
  _prevState: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  /* 1. Honeypot + minimum fill time */
  const honeypot = String(formData.get("website") ?? "");
  const startedAt = Number(formData.get("startedAt") ?? 0);
  const elapsed = Date.now() - startedAt;
  if (honeypot !== "" || (startedAt > 0 && elapsed >= 0 && elapsed < 3000)) {
    return { success: true }; // pretend success so bots don't adapt
  }

  /* 2. Validate */
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

  /* 3. Rate limit */
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256")
    .update(`${process.env.RATE_LIMIT_SALT ?? ""}:${ip}`)
    .digest("hex");

  try {
    const [perIp, global] = await Promise.all([
      sql`SELECT count(*)::int AS n FROM rsvp
          WHERE ip_hash = ${ipHash}
            AND created_at > now() - make_interval(mins => ${IP_WINDOW_MIN})`,
      sql`SELECT count(*)::int AS n FROM rsvp
          WHERE created_at > now() - interval '1 hour'`,
    ]);

    if (perIp[0].n >= IP_LIMIT || global[0].n >= GLOBAL_LIMIT) {
      return {
        message: "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.",
      };
    }

    /* 4. Insert, or update if this guest already answered */
    await sql`
      INSERT INTO rsvp (name, attending, guests, side, ip_hash)
      VALUES (${name}, ${attending}, ${guests}, ${side}, ${ipHash})
      ON CONFLICT (lower(name), side)
      DO UPDATE SET attending = EXCLUDED.attending,
                    guests    = EXCLUDED.guests,
                    ip_hash   = EXCLUDED.ip_hash,
                    created_at = now()
    `;
  } catch (error) {
    console.error("RSVP insert failed:", error);
    return { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }

  return { success: true, message: "Cảm ơn bạn đã xác nhận!" };
}
