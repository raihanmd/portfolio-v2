import type { CollectionConfig } from "payload";

export const Experiences: CollectionConfig = {
  slug: "experiences",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "position", "dateStart", "isCurrent"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "href",
      type: "text",
      admin: {
        description: "Company website URL (optional)",
      },
    },
    {
      name: "country",
      type: "text",
    },
    {
      name: "position",
      type: "text",
      required: true,
    },
    {
      name: "isCurrent",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Check if you still work here",
      },
    },
    {
      name: "dateStart",
      type: "date",
      required: true,
    },
    {
      name: "dateEnd",
      type: "date",
      required: true,
      admin: {
        condition: (_, siblingData) => !siblingData?.isCurrent,
        description: "Leave empty if currently working here",
      },
    },
  ],
};
