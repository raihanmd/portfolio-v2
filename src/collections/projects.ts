import type { CollectionConfig } from "payload";
import { getYouTubeVideoId } from "../lib/youtube";

const categories = [
  { label: "Web Development", value: "web" },
  { label: "Web3 & Blockchain", value: "web3" },
  { label: "Security", value: "security" },
];

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "featured", "order", "_status"],
  },
  access: {
    read: ({ req }) =>
      req.user ? true : { _status: { equals: "published" } },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: { drafts: true },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "longDescription", type: "textarea" },
    {
      name: "category",
      type: "select",
      required: true,
      hasMany: true,
      options: categories,
    },
    {
      name: "projectStatus",
      type: "select",
      required: true,
      defaultValue: "completed",
      options: ["completed", "in-progress", "archived"],
    },
    {
      name: "tags",
      type: "array",
      fields: [{ name: "name", type: "text", required: true }],
    },
    {
      name: "videos",
      type: "array",
      admin: {
        description: "Videos appear before images in the project carousel.",
      },
      fields: [
        {
          name: "source",
          type: "select",
          required: true,
          defaultValue: "youtube",
          options: ["youtube", "upload"],
        },
        {
          name: "youtubeUrl",
          type: "text",
          validate: (
            value: string | null | undefined,
            { siblingData }: { siblingData: { source?: string } },
          ) => {
            if (siblingData.source !== "youtube") return true;
            return typeof value === "string" && getYouTubeVideoId(value)
              ? true
              : "Enter a valid YouTube watch, share, shorts, or embed URL.";
          },
          admin: {
            condition: (_, siblingData) => siblingData?.source === "youtube",
            description: "YouTube watch, share, or embed URL.",
          },
        },
        {
          name: "file",
          type: "upload",
          relationTo: "project-media",
          filterOptions: { mimeType: { contains: "video/" } },
          validate: (
            value: unknown,
            { siblingData }: { siblingData: { source?: string } },
          ) =>
            siblingData.source !== "upload" || Boolean(value)
              ? true
              : "Choose an uploaded video.",
          admin: { condition: (_, siblingData) => siblingData?.source === "upload" },
        },
      ],
    },
    {
      name: "images",
      type: "array",
      admin: { description: "Images appear after videos, in this order." },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "project-media",
          required: true,
          filterOptions: { mimeType: { contains: "image/" } },
        },
      ],
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "year", type: "number", required: true, min: 1990, max: 2100 },
    {
      name: "order",
      type: "number",
      admin: { description: "Lower numbers appear first within a group." },
    },
    {
      name: "links",
      type: "array",
      fields: [
        {
          name: "label",
          type: "select",
          required: true,
          options: ["github", "live", "figma", "docs", "demo"],
        },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "metrics",
      type: "group",
      fields: [
        { name: "users", type: "number", min: 0 },
        { name: "stars", type: "number", min: 0 },
        { name: "downloads", type: "number", min: 0 },
        { name: "forks", type: "number", min: 0 },
      ],
    },
  ],
};
