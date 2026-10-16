import { getPayload } from "payload";

import config from "../../payload.config";
import type { Blog } from "../../payload-types";

/**
 * Resolve a blog article by its title-based slug (e.g. `my-first-post`), so
 * soft-navigations to `/blog/<slug>` open the intercepting modal.
 */
export async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  const payload = await getPayload({ config });
  try {
    const result = await payload.find({
      collection: "blogs",
      where: {
        slug: { equals: slug },
      },
      depth: 1,
      limit: 1,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
}
