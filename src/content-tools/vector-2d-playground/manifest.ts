import type { ContentToolManifest } from "../types";

const manifest = {
  slug: "vector2dPlayground",
  kind: "tool",
  surfaces: ["blog", "til", "playground"],
  width: "wide",
} as const satisfies ContentToolManifest;

export default manifest;
