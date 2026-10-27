import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { rateLimitRepository } from "../repository/rate-limit";

export async function checkActionRateLimit(
  action: "rsvp" | "wish",
  limit: number,
  windowSec: number,
) {
  const requestHeaders = await headers();
  const clientIp =
    requestHeaders.get("x-real-ip")?.trim() ||
    requestHeaders.get("cf-connecting-ip")?.trim() ||
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const ipHash = createHash("sha256").update(clientIp).digest("hex");

  return rateLimitRepository.hit(`${action}:${ipHash}`, limit, windowSec);
}
