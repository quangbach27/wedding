import "server-only";
import { sql } from "../db";

export type RateLimitResult = {
  ok: boolean;
  count: number;
  remaining: number;
  retryAfter: number;
};

type RateLimitRow = {
  count: number;
  retry_after: number;
};

export const rateLimitRepository = {
  async hit(
    key: string,
    limit: number,
    windowSec: number,
  ): Promise<RateLimitResult> {
    const rows = (await sql`
      INSERT INTO rate_limits (key, window_start, count)
      VALUES (
        ${key},
        to_timestamp(
          floor(extract(epoch from now()) / ${windowSec}::int) * ${windowSec}::int
        ),
        1
      )
      ON CONFLICT (key, window_start)
      DO UPDATE SET count = rate_limits.count + 1
      RETURNING
        count,
        extract(
          epoch from (
            window_start + make_interval(secs => ${windowSec}::int) - now()
          )
        )::int AS retry_after
    `) as RateLimitRow[];

    const { count, retry_after: retryAfter } = rows[0];
    return {
      ok: count <= limit,
      count,
      remaining: Math.max(0, limit - count),
      retryAfter: Math.max(1, retryAfter),
    };
  },

  async deleteExpired(olderThanHours = 24): Promise<void> {
    await sql`
      DELETE FROM rate_limits
      WHERE window_start < now() - make_interval(hours => ${olderThanHours}::int)
    `;
  },
};
