import type { Pool } from "pg";

interface UploadNode {
  type?: string;
  relationTo?: string;
  value?: unknown;
  children?: UploadNode[];
}

interface BlogMediaRow {
  id: number;
  alt: string | null;
  caption: string | null;
  url: string | null;
  filename: string | null;
  mimeType: string | null;
  width: number | null;
  height: number | null;
}

export async function populateBlogMediaUploads(
  pool: Pool,
  content: unknown,
): Promise<void> {
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

  const { rows } = await pool.query<BlogMediaRow>(
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
