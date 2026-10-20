import { randomBytes } from "node:crypto";

import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

import { getBlogViews, incrementBlogView } from "../lib/query-blog";
import { Vector2DPlaygroundBlock } from "../blocks/vector-2d-playground";

function slugify(title: string): string {
  return (
    title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100)
      .replace(/-$/g, "") || "article"
  );
}

const viewHits = new Map<string, { count: number; resetAt: number }>();

function limited(key: string, max: number, now: number): boolean {
  const entry = viewHits.get(key);
  if (!entry || entry.resetAt <= now) {
    viewHits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export const Blogs: CollectionConfig = {
  slug: "blogs",
  labels: { singular: "Blog Article", plural: "Blog Articles" },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "slug",
      "category",
      "series",
      "publishedAt",
      "views",
      "_status",
    ],
    listSearchableFields: ["title", "slug"],
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
          | { id?: number; title?: string; slug?: string; publishedAt?: string }
          | undefined;
        const title =
          typeof data.title === "string" ? data.title : previous?.title;
        if (!title) return data;

        // A URL that has been published must remain stable across title edits.
        if (previous?.publishedAt && previous.slug) {
          data.slug = previous.slug;
          return data;
        }
        if (previous?.title === title && previous.slug) {
          data.slug = previous.slug;
          return data;
        }

        const base = slugify(title);
        const isTaken = async (candidate: string) => {
          const result = await req.payload.find({
            collection: "blogs",
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
      async ({ data, operation, originalDoc }) => {
        if (!data) return data;
        const previous = originalDoc as
          | { id?: number; publishedAt?: string; slug?: string }
          | undefined;
        data.publishedAt =
          previous?.publishedAt ??
          (data._status === "published" ? new Date().toISOString() : null);
        if (previous?.publishedAt && previous.slug) data.slug = previous.slug;

        if (operation === "update" && previous?.id) {
          const views = await getBlogViews(previous.id);
          if (views === null)
            throw new Error("Unable to read the live blog view count.");
          data.views = views;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, index: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "Generated from the title. Locked after first publication.",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "blog-categories",
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "series",
      type: "relationship",
      relationTo: "blog-series",
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "blog-media",
      admin: {
        description: "Optional. Appears above the article and in its preview.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({ enabledCollections: ["blog-media"] }),
          BlocksFeature({ blocks: [CodeBlock(), Vector2DPlaygroundBlock] }),
        ],
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
        description: "Set once when this article is first published.",
      },
    },
    {
      name: "views",
      type: "number",
      defaultValue: 0,
      access: { read: ({ req }) => Boolean(req.user) },
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Standalone page views, once per browser session.",
      },
    },
  ],
  endpoints: [
    {
      path: "/:id/view",
      method: "post",
      handler: async (req) => {
        const id = Number(req.routeParams?.id);
        if (!Number.isSafeInteger(id) || id <= 0) {
          return Response.json(
            { error: "Invalid article id" },
            { status: 400 },
          );
        }
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";
        const now = Date.now();
        if (viewHits.size > 10_000) {
          for (const [key, entry] of viewHits) {
            if (entry.resetAt <= now) viewHits.delete(key);
          }
        }
        if (limited(`${ip}:${id}`, 20, now) || limited(ip, 120, now)) {
          return Response.json(
            { error: "Too many requests" },
            { status: 429, headers: { "Retry-After": "60" } },
          );
        }
        const views = await incrementBlogView(id);
        if (views === null) {
          return Response.json({ error: "Article not found" }, { status: 404 });
        }
        return Response.json({ ok: true, views });
      },
    },
  ],
};
