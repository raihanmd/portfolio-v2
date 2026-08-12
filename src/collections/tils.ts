import { createId } from "@paralleldrive/cuid2";
import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Tils: CollectionConfig = {
  slug: "tils",
  admin: {
    useAsTitle: "date",
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Custom string id (cuid2) instead of the autoincrement integer.
        if (operation === "create" && data && !data.id) {
          data.id = createId();
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      index: true,
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [CodeBlock()],
          }),
        ],
      }),
      required: true,
    },
  ],
};
