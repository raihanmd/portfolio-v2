import type { CollectionConfig } from "payload";

export const BlogCategories: CollectionConfig = {
  slug: "blog-categories",
  labels: { singular: "Blog Category", plural: "Blog Categories" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "updatedAt"] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [{ name: "name", type: "text", required: true, unique: true }],
};
