import "server-only";
import type { z } from "zod";
import { sql } from "../db";
import type { createRsvpSchema } from "../validation/rsvp";

export type RsvpInput = z.infer<typeof createRsvpSchema>;

export type Rsvp = RsvpInput & {
  id: string;
  createdAt: string; // ISO string
};

type RsvpRow = {
  id: number;
  name: string;
  attending: RsvpInput["attending"];
  guests: number;
  side: RsvpInput["side"];
  created_at: string | Date;
};

const toRsvp = (row: RsvpRow): Rsvp => ({
  id: String(row.id),
  name: row.name,
  attending: row.attending,
  guests: row.guests,
  side: row.side,
  createdAt: new Date(row.created_at).toISOString(),
});

export const rsvpRepository = {
  async create({ name, attending, guests, side }: RsvpInput): Promise<Rsvp> {
    const rows = (await sql`
      INSERT INTO rsvp (name, attending, guests, side)
      VALUES (${name}, ${attending}, ${guests}, ${side})
      RETURNING id, name, attending, guests, side, created_at
    `) as RsvpRow[];

    return toRsvp(rows[0]);
  },

  async update(
    id: string | number,
    { name, attending, guests, side }: RsvpInput,
  ): Promise<Rsvp | null> {
    const rows = (await sql`
      UPDATE rsvp
      SET name = ${name},
          attending = ${attending},
          guests = ${guests},
          side = ${side}
      WHERE id = ${Number(id)}
      RETURNING id, name, attending, guests, side, created_at
    `) as RsvpRow[];

    return rows[0] ? toRsvp(rows[0]) : null;
  },

  async getById(id: string | number): Promise<Rsvp | null> {
    const rows = (await sql`
      SELECT id, name, attending, guests, side, created_at
      FROM rsvp
      WHERE id = ${Number(id)}
      LIMIT 1
    `) as RsvpRow[];

    return rows[0] ? toRsvp(rows[0]) : null;
  },
};
