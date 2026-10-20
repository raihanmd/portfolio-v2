import type { ReactNode } from "react";

export const CONTENT_TOOL_SURFACES = ["blog", "til", "playground"] as const;

export const DEFAULT_CONTENT_TOOL_SURFACES = CONTENT_TOOL_SURFACES;

export type ContentToolSurface = (typeof CONTENT_TOOL_SURFACES)[number];
export type ContentToolWidth = "prose" | "wide";

export interface ContentToolManifest {
  slug: string;
  kind?: "tool";
  surfaces?: readonly ContentToolSurface[];
  width?: ContentToolWidth;
}

export interface ResolvedContentToolManifest {
  slug: string;
  kind: "tool";
  surfaces: readonly ContentToolSurface[];
  width: ContentToolWidth;
}

export type ContentToolRenderer = (
  fields: Record<string, unknown>,
) => ReactNode;

export function resolveContentToolManifest(
  manifest: ContentToolManifest,
): ResolvedContentToolManifest {
  return {
    slug: manifest.slug,
    kind: manifest.kind ?? "tool",
    surfaces: manifest.surfaces ?? DEFAULT_CONTENT_TOOL_SURFACES,
    width: manifest.width ?? "wide",
  };
}
