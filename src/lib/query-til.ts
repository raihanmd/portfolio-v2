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

interface UploadNode {
  type?: string;
  relationTo?: string;
  value?: unknown;
  children?: UploadNode[];
}

interface ProjectMediaRow {
  id: number;
  alt: string | null;
  url: string | null;
  filename: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  cardURL: string | null;
  cardWidth: number | null;
  cardHeight: number | null;
  cardMimeType: string | null;
  cardFilesize: number | null;
  cardFilename: string | null;
}

async function populateTilUploads(content: Til["content"]): Promise<void> {
  const root = content?.root as { children?: UploadNode[] } | undefined;
  const uploads = new Map<number, UploadNode[]>();

  function collect(nodes: UploadNode[] | undefined) {
    for (const node of nodes ?? []) {
      if (
        node.type === "upload" &&
        node.relationTo === "project-media" &&
        typeof node.value === "number" &&
        Number.isSafeInteger(node.value)
      ) {
        const matches = uploads.get(node.value) ?? [];
        matches.push(node);
        uploads.set(node.value, matches);
      }
      collect(node.children);
    }
  }

  collect(root?.children);
  if (uploads.size === 0) return;

  const { rows } = await pool.query<ProjectMediaRow>(
    `SELECT "id", "alt", "url", "filename", "mime_type" AS "mimeType",
            "width"::integer, "height"::integer,
            "sizes_card_url" AS "cardURL",
            "sizes_card_width"::integer AS "cardWidth",
            "sizes_card_height"::integer AS "cardHeight",
            "sizes_card_mime_type" AS "cardMimeType",
            "sizes_card_filesize"::integer AS "cardFilesize",
            "sizes_card_filename" AS "cardFilename"
     FROM "project_media" WHERE "id" = ANY($1::integer[])`,
    [[...uploads.keys()]],
  );

  for (const media of rows) {
    if (!media.url || !media.mimeType) continue;

    const card =
      media.cardURL &&
      media.cardWidth &&
      media.cardHeight &&
      media.cardMimeType &&
      media.cardFilesize &&
      media.cardFilename
        ? {
            card: {
              url: media.cardURL,
              width: media.cardWidth,
              height: media.cardHeight,
              mimeType: media.cardMimeType,
              filesize: media.cardFilesize,
              filename: media.cardFilename,
            },
          }
        : undefined;

    for (const node of uploads.get(media.id) ?? []) {
      node.value = {
        id: media.id,
        alt: media.alt,
        url: media.url,
        filename: media.filename,
        mimeType: media.mimeType,
        width: media.width,
        height: media.height,
        sizes: card,
      };
    }
  }
}

/**
 * Resolve a TIL by its cuid id OR its date-based slug (e.g. `2026-08-12`).
 * Ids and slugs can never collide (cuid2 ids are dashless), so a single
 * `WHERE id = $1 OR slug = $1` is unambiguous. Old `/til/<id>` links keep
 * working after the slug migration.
 */
export async function fetchTilFast(
  idOrSlug: string,
  options: { populateUploads?: boolean } = {},
): Promise<Til | null> {
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

    if (options.populateUploads) {
      try {
        await populateTilUploads(row.content);
      } catch (error) {
        console.error("Unable to populate TIL uploads", error);
      }
    }

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
 * value (0). Update both rows in one transaction so concurrent page views
 * cannot leave the latest admin snapshot behind the live count.
 */
export async function incrementTilView(id: string): Promise<number | null> {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const { rows } = await client.query<{ views: number }>(
      `UPDATE "tils" SET "views" = COALESCE("views", 0) + 1
       WHERE "id" = $1 AND "_status" = 'published'
       RETURNING "views"`,
      [id],
    );
    const row = rows[0];
    if (!row) {
      await client.query("ROLLBACK");
      return null;
    }
    const views = Number(row.views);
    await client.query(
      `UPDATE "_tils_v" SET "version_views" = $1
       WHERE "parent_id" = $2 AND "latest" = true`,
      [views, id],
    );
    await client.query("COMMIT");
    return views;
  } catch {
    if (client) await client.query("ROLLBACK").catch(() => undefined);
    return null;
  } finally {
    client?.release();
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
