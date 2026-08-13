import { Pool } from "pg";

import type { Til } from "../../payload-types";

/**
 * Lightweight TIL lookup straight from Postgres — skips the full Payload boot
 * (`getPayload`) so crawler-facing routes (detail page + OG image) stay fast
 * and don't depend on the whole CMS initializing per request.
 *
 * Payload names columns snake_case in Postgres (confirmed by the schema):
 * `tils(id, slug, date, content, views, created_at, updated_at, _status)`.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface TilRow {
  id: string;
  slug: string | null;
  date: Date;
  content: Til["content"];
  createdAt: Date;
  updatedAt: Date;
  _status: string | null;
}

/**
 * Resolve a TIL by its cuid id OR its date-based slug (e.g. `2026-08-12`).
 * Ids and slugs can never collide (cuid2 ids are dashless), so a single
 * `WHERE id = $1 OR slug = $1` is unambiguous. Old `/til/<id>` links keep
 * working after the slug migration.
 */
export async function fetchTilFast(idOrSlug: string): Promise<Til | null> {
  try {
    const { rows } = await pool.query<TilRow>(
      `SELECT "id", "slug", "date", "content", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "_status"
       FROM "tils"
       WHERE ("id" = $1 OR "slug" = $1) AND "_status" = 'published'
       LIMIT 1`,
      [idOrSlug],
    );

    const row = rows[0];
    if (!row) return null;

    // Row shape matches the generated Til type (snake_case columns aliased above).
    return row as unknown as Til;
  } catch {
    return null;
  }
}

/**
 * Atomically increments the view counter for a published TIL and returns the
 * new value. Raw SQL (not a Payload update) on purpose: it must not touch
 * `updatedAt` or create a new draft version for every page view.
 * `COALESCE` guards rows backfilled before the field existed (NULL → 0).
 *
 * The Payload admin reads documents with `draft: true`, which resolves to the
 * LATEST VERSION SNAPSHOT in `_tils_v` — not the live `tils` row. If we only
 * bumped the main table, the admin would keep showing the stale snapshot
 * value (0). So the latest snapshot is synced too (best-effort).
 */
export async function incrementTilView(id: string): Promise<number | null> {
  try {
    const { rows } = await pool.query<{ views: number }>(
      `UPDATE "tils" SET "views" = COALESCE("views", 0) + 1
       WHERE "id" = $1
       RETURNING "views"`,
      [id],
    );
    const row = rows[0];
    if (!row) return null;
    const views = Number(row.views);

    try {
      await pool.query(
        `UPDATE "_tils_v" SET "version_views" = $1
         WHERE "parent_id" = $2 AND "latest" = true`,
        [views, id],
      );
    } catch {
      // Snapshot sync is best-effort; the counter itself already succeeded.
    }

    return views;
  } catch {
    return null;
  }
}

/**
 * Live view count straight from the main table. Used by the collection's
 * `beforeChange` hook so admin edits can never overwrite the counter with the
 * stale form value (the form loads from the version snapshot, not the live row).
 */
export async function getTilViews(id: string): Promise<number | null> {
  try {
    const { rows } = await pool.query<{ views: number }>(
      `SELECT "views" FROM "tils" WHERE "id" = $1`,
      [id],
    );
    return rows[0] ? Number(rows[0].views) : null;
  } catch {
    return null;
  }
}
