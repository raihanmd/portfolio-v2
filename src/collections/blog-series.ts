import type { CollectionConfig } from "payload";

export const BlogSeries: CollectionConfig = {
  slug: "blog-series",
  labels: { singular: "Blog Series", plural: "Blog Series" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "description", "updatedAt"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
  ],
};
