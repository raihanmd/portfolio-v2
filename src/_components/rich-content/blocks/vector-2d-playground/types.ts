export type VectorVisual = "arrow" | "dot";
export type VectorColor = "blue" | "green" | "orange" | "purple";

export interface VectorExpressionConfig {
  expression: string;
  label?: string | null;
  visual?: VectorVisual | null;
  color?: VectorColor | null;
}

export interface Vector2DPlaygroundConfig {
  expressions?: VectorExpressionConfig[] | null;
  allowEditing?: boolean | null;
  allowColorChange?: boolean | null;
  allowPanZoom?: boolean | null;
  showGrid?: boolean | null;
  showAxes?: boolean | null;
  caption?: string | null;
}

export interface VectorValue {
  x: number;
  y: number;
}

export type ParsedVectorExpression =
  | { type: "vector"; value: VectorValue }
  | {
      type: "addition";
      left: VectorValue;
      right: VectorValue;
      value: VectorValue;
    };
