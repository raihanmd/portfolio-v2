"use client";

import Vector2DPlayground from "./component.client";
import type { Vector2DPlaygroundConfig } from "./types";

export default function renderVector2DPlayground(
  fields: Record<string, unknown>,
) {
  return (
    <Vector2DPlayground
      config={fields as unknown as Vector2DPlaygroundConfig}
    />
  );
}
