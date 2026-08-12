import { Pool } from "pg";

import type { Til } from "../../payload-types";

/**
 * Lightweight TIL lookup straight from Postgres — skips the full Payload boot
 * (`getPayload`) so crawler-facing routes (detail page + OG image) stay fast
 * and don't depend on the whole CMS initializing per request.
 *
 * Payload names columns snake_case in Postgres (confirmed by the schema):
 * `tils(id, date, content, created_at, updated_at, _status)`.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface TilRow {
  id: string;
  date: Date;
  content: Til["content"];
  createdAt: Date;
  updatedAt: Date;
  _status: string | null;
}

export async function fetchTilFast(id: string): Promise<Til | null> {
  try {
    const { rows } = await pool.query<TilRow>(
      `SELECT "id", "date", "content", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "_status"
       FROM "tils"
       WHERE "id" = $1 AND "_status" = 'published'
       LIMIT 1`,
      [id],
    );

    const row = rows[0];
    if (!row) return null;

    // Row shape matches the generated Til type (snake_case columns aliased above).
    return row as unknown as Til;
  } catch {
    return null;
  }
}
