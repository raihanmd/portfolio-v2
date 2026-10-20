import { Pool } from "pg";

import { populateBlogMediaUploads } from "./populate-blog-media";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface PlaygroundEntry {
  id: number;
  name: string;
  slug: string;
  description: string;
  content: unknown;
  publishedAt: Date;
  updatedAt: Date;
}

export type PlaygroundSummary = Omit<PlaygroundEntry, "content">;

export async function getPlaygroundBySlug(
  slug: string,
  options: { populateUploads?: boolean } = {},
): Promise<PlaygroundEntry | null> {
  const { rows } = await pool.query<PlaygroundEntry>(
    `SELECT id, name, slug, description, content,
            published_at AS "publishedAt", updated_at AS "updatedAt"
     FROM playgrounds
     WHERE slug = $1 AND _status = 'published' AND published_at IS NOT NULL
     LIMIT 1`,
    [slug],
  );
  const entry = rows[0];
  if (!entry) return null;
  if (options.populateUploads) {
    await populateBlogMediaUploads(pool, entry.content);
  }
  return entry;
}

export async function getPublishedPlaygroundSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  const { rows } = await pool.query<{ slug: string; updatedAt: Date }>(
    `SELECT slug, updated_at AS "updatedAt" FROM playgrounds
     WHERE _status = 'published' AND published_at IS NOT NULL`,
  );
  return rows;
}
