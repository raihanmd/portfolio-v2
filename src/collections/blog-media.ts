import path from "path";
import type { CollectionConfig } from "payload";

const storageConfigured = [
  "SUPABASE_S3_ENDPOINT",
  "SUPABASE_S3_REGION",
  "SUPABASE_S3_BUCKET",
  "SUPABASE_S3_ACCESS_KEY_ID",
  "SUPABASE_S3_SECRET_ACCESS_KEY",
  "SUPABASE_STORAGE_PUBLIC_URL",
].every((name) => Boolean(process.env[name]));

export const BlogMedia: CollectionConfig = {
  slug: "blog-media",
  labels: { singular: "Blog Image", plural: "Blog Images" },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "alt", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) && storageConfigured,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "media/blog-media"),
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ],
    imageSizes: [{ name: "card", width: 800 }],
    adminThumbnail: "card",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe the image for readers using assistive technology.",
      },
    },
  ],
};
