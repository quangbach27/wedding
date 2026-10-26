import "server-only";
import { sql } from "../db";

export type Wish = {
  id: string;
  name: string;
  message: string;
  createdAt: string; // ISO string
};

type WishRow = {
  id: number;
  name: string;
  message: string;
  created_at: string | Date;
};

const toWish = (row: WishRow): Wish => ({
  id: String(row.id),
  name: row.name,
  message: row.message,
  createdAt: new Date(row.created_at).toISOString(),
});

export type CreateWishInput = {
  name: string;
  message: string;
};
export type WishPage = {
  items: Wish[];
  nextCursor: string | null; // null = no more pages
};
export const wishRepository = {
  async create({ name, message }: CreateWishInput): Promise<Wish> {
    const rows = (await sql`
      INSERT INTO wishes (name, message)
      VALUES (${name}, ${message})
      RETURNING id, name, message, created_at
    `) as WishRow[];

    return toWish(rows[0]);
  },

  async getLatest(): Promise<Wish | null> {
    const rows = (await sql`
      SELECT id, name, message, created_at
      FROM wishes
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `) as WishRow[];

    return rows[0] ? toWish(rows[0]) : null;
  },
  async list({
    limit = 10,
    cursor = null,
  }: {
    limit?: number;
    cursor?: number | null;
  } = {}): Promise<WishPage> {
    const rows = (await sql`
      SELECT id, name, message, created_at
      FROM wishes
      WHERE (${cursor}::int IS NULL OR id < ${cursor}::int)
      ORDER BY id DESC
      LIMIT ${limit + 1}
    `) as WishRow[];

    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map(toWish);

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    };
  },
};
