import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
  UploadFeature,
} from "@payloadcms/richtext-lexical";

import { getContentToolBlocks } from "~/content-tools/generated/server";
import type { ContentToolSurface } from "~/content-tools/types";
import { MathFeature } from "~/lexical/math/feature.server";

interface ContentEditorOptions {
  surface: ContentToolSurface;
  uploadCollection?: "blog-media";
}

export function createContentEditor({
  surface,
  uploadCollection,
}: ContentEditorOptions) {
  return lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      MathFeature(),
      ...(uploadCollection
        ? [UploadFeature({ enabledCollections: [uploadCollection] })]
        : []),
      BlocksFeature({
        blocks: [CodeBlock(), ...getContentToolBlocks(surface)],
      }),
    ],
  });
}
