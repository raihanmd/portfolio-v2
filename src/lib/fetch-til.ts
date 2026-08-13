import { getPayload } from "payload";

import config from "../../payload.config";
import type { Til } from "../../payload-types";

/**
 * Resolve a TIL by its cuid id OR its date-based slug (e.g. `2026-08-12`), so
 * both old `/til/<id>` links and new slug URLs open the intercepting modal.
 */
export async function fetchTilById(idOrSlug: string): Promise<Til | null> {
  const payload = await getPayload({ config });
  try {
    const result = await payload.find({
      collection: "tils",
      where: {
        or: [{ id: { equals: idOrSlug } }, { slug: { equals: idOrSlug } }],
      },
      depth: 0,
      limit: 1,
    });
    return result.docs[0] ?? null;
  } catch {
    return null;
  }
}
