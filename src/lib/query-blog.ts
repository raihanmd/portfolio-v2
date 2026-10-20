import { Pool } from "pg";

import { extractTilText, truncateText } from "./til-text";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PAGE_SIZE = 10;

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  content: unknown;
  publishedAt: Date;
  updatedAt: Date;
  categoryId: number | null;
  categoryName: string | null;
  seriesId: number | null;
  seriesName: string | null;
  coverURL: string | null;
  coverCardURL: string | null;
  coverAlt: string | null;
  excerpt: string;
}

type BlogRow = Omit<BlogArticle, "excerpt">;

export interface BlogFilter {
  search?: string;
  category?: number;
  series?: number;
  cursor?: string;
}

export interface BlogList {
  articles: BlogArticle[];
  nextCursor: string | null;
}

export interface BlogCategoryOption {
  id: number;
  name: string;
}

export interface BlogSeriesOption {
  id: number;
  name: string;
  description: string | null;
  firstPublishedAt: Date;
  articleCount: number;
  matchingArticles: { title: string; slug: string }[];
}

export interface BlogSeriesSection extends BlogSeriesOption {
  articles: BlogArticle[];
}

function searchPattern(search: string): string {
  return `%${search.replace(/[\\%_]/g, "\\$&")}%`;
}

function encodeCursor(row: BlogArticle): string {
  return Buffer.from(
    JSON.stringify([row.publishedAt.toISOString(), row.id]),
  ).toString("base64url");
}

function decodeCursor(value: string | undefined): [Date, number] | null {
  if (!value || value.length > 200) return null;
  try {
    const tuple = JSON.parse(
      Buffer.from(value, "base64url").toString(),
    ) as unknown;
    if (!Array.isArray(tuple) || tuple.length !== 2) return null;
    const timestamp: unknown = tuple[0];
    const id: unknown = tuple[1];
    if (
      typeof timestamp !== "string" ||
      typeof id !== "number" ||
      !Number.isSafeInteger(id) ||
      id <= 0
    )
      return null;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : [date, id];
  } catch {
    return null;
  }
}

function articleFromRow(row: BlogRow): BlogArticle {
  return {
    ...row,
    excerpt: truncateText(extractTilText(row.content), 180),
  };
}

export async function getBlogList(filter: BlogFilter): Promise<BlogList> {
  const cursor = decodeCursor(filter.cursor);
  const search = filter.search?.trim().slice(0, 100) ?? "";
  const { rows } = await pool.query<BlogRow>(
    `SELECT b.id, b.slug, b.title, b.content,
            b.published_at AS "publishedAt", b.updated_at AS "updatedAt",
            b.category_id AS "categoryId", c.name AS "categoryName",
            b.series_id AS "seriesId", s.name AS "seriesName",
            m.url AS "coverURL", m.sizes_card_url AS "coverCardURL",
            m.alt AS "coverAlt"
     FROM blogs b
     LEFT JOIN blog_categories c ON c.id = b.category_id
     LEFT JOIN blog_series s ON s.id = b.series_id
     LEFT JOIN blog_media m ON m.id = b.cover_id
     WHERE b._status = 'published' AND b.published_at IS NOT NULL
       AND ($1::integer IS NULL OR b.category_id = $1)
       AND ($2::integer IS NULL OR b.series_id = $2)
       AND ($3::text = '' OR b.title ILIKE $4 ESCAPE '\\')
       AND ($5::timestamptz IS NULL OR (b.published_at, b.id) < ($5, $6::integer))
     ORDER BY b.published_at DESC, b.id DESC
     LIMIT $7`,
    [
      filter.category ?? null,
      filter.series ?? null,
      search,
      searchPattern(search),
      cursor?.[0] ?? null,
      cursor?.[1] ?? null,
      PAGE_SIZE + 1,
    ],
  );
  const articles = rows.slice(0, PAGE_SIZE).map(articleFromRow);
  return {
    articles,
    nextCursor:
      rows.length > PAGE_SIZE && articles.length > 0
        ? encodeCursor(articles[articles.length - 1]!)
        : null,
  };
}

export async function getBlogCategories(): Promise<BlogCategoryOption[]> {
  const { rows } = await pool.query<BlogCategoryOption>(
    `SELECT DISTINCT c.id, c.name
     FROM blog_categories c
     JOIN blogs b ON b.category_id = c.id
     WHERE b._status = 'published' AND b.published_at IS NOT NULL
     ORDER BY c.name ASC`,
  );
  return rows;
}

export async function getBlogSeries(search = ""): Promise<BlogSeriesOption[]> {
  const term = search.trim().slice(0, 100);
  const { rows } = await pool.query<BlogSeriesOption>(
    `SELECT s.id, s.name, s.description,
            MIN(b.published_at) AS "firstPublishedAt",
            COUNT(*)::integer AS "articleCount",
            COALESCE(
              json_agg(json_build_object('title', b.title, 'slug', b.slug)
                ORDER BY b.published_at DESC, b.id DESC)
                FILTER (WHERE $1::text <> '' AND b.title ILIKE $2 ESCAPE '\\'),
              '[]'::json
            ) AS "matchingArticles"
     FROM blog_series s
     JOIN blogs b ON b.series_id = s.id
       AND b._status = 'published' AND b.published_at IS NOT NULL
     GROUP BY s.id
     HAVING $1::text = '' OR s.name ILIKE $2 ESCAPE '\\'
       OR COUNT(*) FILTER (WHERE b.title ILIKE $2 ESCAPE '\\') > 0
     ORDER BY MIN(b.published_at) DESC, s.id DESC`,
    [term, searchPattern(term)],
  );
  return rows;
}

export async function getBlogSeriesSections(
  directory: BlogSeriesOption[],
  search = "",
): Promise<BlogSeriesSection[]> {
  if (directory.length === 0) return [];
  const term = search.trim().slice(0, 100);
  const { rows } = await pool.query<BlogRow>(
    `SELECT b.id, b.slug, b.title, b.content,
            b.published_at AS "publishedAt", b.updated_at AS "updatedAt",
            b.category_id AS "categoryId", c.name AS "categoryName",
            b.series_id AS "seriesId", s.name AS "seriesName",
            m.url AS "coverURL", m.sizes_card_url AS "coverCardURL",
            m.alt AS "coverAlt"
     FROM blogs b
     JOIN blog_series s ON s.id = b.series_id
     LEFT JOIN blog_categories c ON c.id = b.category_id
     LEFT JOIN blog_media m ON m.id = b.cover_id
     WHERE b._status = 'published' AND b.published_at IS NOT NULL
       AND b.series_id = ANY($1::integer[])
       AND ($2::text = '' OR s.name ILIKE $3 ESCAPE '\\'
         OR b.title ILIKE $3 ESCAPE '\\')
     ORDER BY b.published_at DESC, b.id DESC`,
    [directory.map((item) => item.id), term, searchPattern(term)],
  );
  const bySeries = new Map<number, BlogArticle[]>();
  for (const row of rows) {
    if (row.seriesId === null) continue;
    const articles = bySeries.get(row.seriesId) ?? [];
    articles.push(articleFromRow(row));
    bySeries.set(row.seriesId, articles);
  }
  return directory.map((item) => ({
    ...item,
    articles: bySeries.get(item.id) ?? [],
  }));
}

interface UploadNode {
  type?: string;
  relationTo?: string;
  value?: unknown;
  children?: UploadNode[];
}

async function populateBlogUploads(content: unknown): Promise<void> {
  const root = (content as { root?: { children?: UploadNode[] } } | null)?.root;
  const references = new Map<number, UploadNode[]>();
  function collect(nodes: UploadNode[] | undefined) {
    for (const node of nodes ?? []) {
      if (
        node.type === "upload" &&
        node.relationTo === "blog-media" &&
        typeof node.value === "number" &&
        Number.isSafeInteger(node.value)
      ) {
        const matches = references.get(node.value) ?? [];
        matches.push(node);
        references.set(node.value, matches);
      }
      collect(node.children);
    }
  }
  collect(root?.children);
  if (references.size === 0) return;
  const { rows } = await pool.query<{
    id: number;
    alt: string | null;
    caption: string | null;
    url: string | null;
    filename: string | null;
    mimeType: string | null;
    width: number | null;
    height: number | null;
  }>(
    `SELECT id, alt, caption, url, filename, mime_type AS "mimeType",
            width::integer, height::integer
     FROM blog_media WHERE id = ANY($1::integer[])`,
    [[...references.keys()]],
  );
  for (const media of rows) {
    if (!media.url || !media.mimeType) continue;
    for (const node of references.get(media.id) ?? []) node.value = media;
  }
}

export async function getBlogBySlug(
  slug: string,
  options: { populateUploads?: boolean } = {},
): Promise<BlogArticle | null> {
  const { rows } = await pool.query<BlogRow>(
    `SELECT b.id, b.slug, b.title, b.content,
            b.published_at AS "publishedAt", b.updated_at AS "updatedAt",
            b.category_id AS "categoryId", c.name AS "categoryName",
            b.series_id AS "seriesId", s.name AS "seriesName",
            m.url AS "coverURL", m.sizes_card_url AS "coverCardURL",
            m.alt AS "coverAlt"
     FROM blogs b
     LEFT JOIN blog_categories c ON c.id = b.category_id
     LEFT JOIN blog_series s ON s.id = b.series_id
     LEFT JOIN blog_media m ON m.id = b.cover_id
     WHERE b.slug = $1 AND b._status = 'published' AND b.published_at IS NOT NULL
     LIMIT 1`,
    [slug],
  );
  const row = rows[0];
  if (!row) return null;
  if (options.populateUploads) await populateBlogUploads(row.content);
  return articleFromRow(row);
}

export async function getPublishedBlogSlugs(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  const { rows } = await pool.query<{ slug: string; updatedAt: Date }>(
    `SELECT slug, updated_at AS "updatedAt" FROM blogs
     WHERE _status = 'published' AND published_at IS NOT NULL`,
  );
  return rows;
}

export async function getBlogViews(id: number): Promise<number | null> {
  const { rows } = await pool.query<{ views: number }>(
    `SELECT views FROM blogs WHERE id = $1`,
    [id],
  );
  return rows[0] ? Number(rows[0].views) : null;
}

export async function incrementBlogView(id: number): Promise<number | null> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ views: number }>(
      `UPDATE blogs SET views = COALESCE(views, 0) + 1
       WHERE id = $1 AND _status = 'published'
       RETURNING views`,
      [id],
    );
    const row = rows[0];
    if (!row) {
      await client.query("ROLLBACK");
      return null;
    }
    const views = Number(row.views);
    await client.query(
      `UPDATE _blogs_v SET version_views = $1 WHERE parent_id = $2 AND latest = true`,
      [views, id],
    );
    await client.query("COMMIT");
    return views;
  } catch {
    await client.query("ROLLBACK").catch(() => undefined);
    return null;
  } finally {
    client.release();
  }
}
