import { randomBytes } from "node:crypto";

import type { CollectionConfig } from "payload";

import { createContentEditor } from "../lib/content-editor";

function slugify(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100)
      .replace(/-$/g, "") || "tool"
  );
}

export const Playgrounds: CollectionConfig = {
  slug: "playgrounds",
  labels: { singular: "Playground", plural: "Playgrounds" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "publishedAt", "_status"],
    listSearchableFields: ["name", "slug"],
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: { autosave: true } },
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data) return data;
        const previous = originalDoc as
          | { id?: number; name?: string; slug?: string; publishedAt?: string }
          | undefined;
        const name = typeof data.name === "string" ? data.name : previous?.name;
        if (!name) return data;

        if (previous?.publishedAt && previous.slug) {
          data.slug = previous.slug;
          return data;
        }
        if (previous?.name === name && previous.slug) {
          data.slug = previous.slug;
          return data;
        }

        const base = slugify(name);
        const isTaken = async (candidate: string) => {
          const result = await req.payload.find({
            collection: "playgrounds",
            overrideAccess: true,
            draft: true,
            depth: 0,
            limit: 2,
            where: { slug: { equals: candidate } },
          });
          return result.docs.some((doc) => doc.id !== previous?.id);
        };

        let candidate = base;
        if (await isTaken(candidate)) {
          for (let attempt = 0; attempt < 8; attempt += 1) {
            candidate = `${base}-${randomBytes(3).toString("hex")}`;
            if (!(await isTaken(candidate))) break;
          }
        }
        data.slug = candidate;
        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!data) return data;
        const previous = originalDoc as
          | { publishedAt?: string; slug?: string }
          | undefined;
        data.publishedAt =
          previous?.publishedAt ??
          (data._status === "published" ? new Date().toISOString() : null);
        if (previous?.publishedAt && previous.slug) data.slug = previous.slug;
        return data;
      },
    ],
  },
  fields: [
    { name: "name", type: "text", required: true, index: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Generated from the name and locked after first publish.",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      maxLength: 240,
      admin: {
        description: "Short summary shown in the Playground list and metadata.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: createContentEditor({
        surface: "playground",
        uploadCollection: "blog-media",
      }),
    },
    {
      name: "publishedAt",
      type: "date",
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        date: { pickerAppearance: "dayAndTime" },
        description: "Set once when this playground is first published.",
      },
    },
  ],
};
