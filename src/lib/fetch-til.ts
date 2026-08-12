import { getPayload } from "payload";

import config from "../../payload.config";
import type { Til } from "../../payload-types";

export async function fetchTilById(id: string): Promise<Til | null> {
  const payload = await getPayload({ config });
  try {
    return await payload.findByID({
      collection: "tils",
      id,
      depth: 0,
    });
  } catch {
    return null;
  }
}
