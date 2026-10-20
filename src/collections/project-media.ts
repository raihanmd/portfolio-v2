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

export const ProjectMedia: CollectionConfig = {
  slug: "project-media",
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "mimeType", "alt", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user) && storageConfigured,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "media/project-media"),
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
      "video/mp4",
      "video/webm",
    ],
    imageSizes: [{ name: "card", width: 800 }],
    adminThumbnail: "card",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description: "Alternative text for images; optional for videos.",
      },
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description:
          "Optional text shown below the image, such as a source or credit.",
      },
    },
  ],
};
