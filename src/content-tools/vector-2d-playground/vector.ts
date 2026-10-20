import type { ParsedVectorExpression, VectorValue } from "./types";

const NUMBER = "[-+]?\\d+(?:\\.\\d+)?";
const VECTOR = new RegExp(`^\\[\\s*(${NUMBER})\\s*,\\s*(${NUMBER})\\s*\\]$`);

function parseVector(value: string): VectorValue | null {
  const match = VECTOR.exec(value.trim());
  if (!match) return null;
  const x = Number(match[1]);
  const y = Number(match[2]);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

export function parseVectorExpression(
  expression: string,
): ParsedVectorExpression | null {
  const value = expression.trim();
  const direct = parseVector(value);
  if (direct) return { type: "vector", value: direct };

  const parts = value.split("+");
  if (parts.length !== 2) return null;
  const left = parseVector(parts[0] ?? "");
  const right = parseVector(parts[1] ?? "");
  if (!left || !right) return null;
  return {
    type: "addition",
    left,
    right,
    value: { x: left.x + right.x, y: left.y + right.y },
  };
}

export function formatVector(value: VectorValue): string {
  return `[${Number(value.x.toFixed(3))}, ${Number(value.y.toFixed(3))}]`;
}

export function valuesForFit(
  expressions: Array<ParsedVectorExpression | null>,
): VectorValue[] {
  return expressions.flatMap((expression) => {
    if (!expression) return [];
    if (expression.type === "vector") return [expression.value];
    return [expression.left, expression.right, expression.value];
  });
}
