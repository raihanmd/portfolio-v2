import type { Block } from "payload";

const vectorExpressionFields = [
  {
    name: "expression",
    type: "text" as const,
    required: true,
    admin: {
      description: "Example: [2, 3] or [4, 5] + [4, 5].",
    },
  },
  {
    name: "label",
    type: "text" as const,
    admin: { description: "Optional label shown on the graph." },
  },
  {
    name: "visual",
    type: "select" as const,
    defaultValue: "arrow",
    options: [
      { label: "Arrow", value: "arrow" },
      { label: "Dot", value: "dot" },
    ],
  },
  {
    name: "color",
    type: "select" as const,
    defaultValue: "blue",
    options: [
      { label: "Blue", value: "blue" },
      { label: "Green", value: "green" },
      { label: "Orange", value: "orange" },
      { label: "Purple", value: "purple" },
    ],
  },
];

const Vector2DPlaygroundBlock: Block = {
  slug: "vector2dPlayground",
  interfaceName: "Vector2DPlaygroundBlock",
  labels: {
    singular: "Vector 2D Playground",
    plural: "Vector 2D Playgrounds",
  },
  fields: [
    {
      name: "expressions",
      type: "array",
      required: true,
      minRows: 1,
      maxRows: 12,
      defaultValue: [
        { expression: "[2, 3]", label: "v", visual: "arrow", color: "blue" },
      ],
      fields: vectorExpressionFields,
    },
    {
      name: "allowEditing",
      type: "checkbox",
      defaultValue: true,
      label: "Allow reader editing",
    },
    {
      name: "allowColorChange",
      type: "checkbox",
      defaultValue: true,
      label: "Allow reader color changes",
    },
    {
      name: "allowPanZoom",
      type: "checkbox",
      defaultValue: true,
      label: "Allow graph pan and zoom",
    },
    {
      name: "showGrid",
      type: "checkbox",
      defaultValue: true,
      label: "Show grid",
    },
    {
      name: "showAxes",
      type: "checkbox",
      defaultValue: true,
      label: "Show axes",
    },
    {
      name: "caption",
      type: "text",
      admin: {
        description: "Optional note shown below the interactive graph.",
      },
    },
  ],
};

export default Vector2DPlaygroundBlock;
