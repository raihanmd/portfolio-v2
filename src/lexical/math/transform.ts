import {
  $isParagraphNode,
  $isTextNode,
  type ParagraphNode,
  type TextNode,
} from "@payloadcms/richtext-lexical/lexical";
import type { MathNode } from "./math-node";
import { findBlockMath, findInlineMath } from "./parse";

type CreateMathNode = (equation: string, inline: boolean) => MathNode;

function isPlainParagraph(node: ParagraphNode) {
  return node
    .getChildren()
    .every(
      (child) =>
        ($isTextNode(child) && child.getFormat() === 0) ||
        child.getType() === "linebreak",
    );
}

export function $transformMathText(
  node: TextNode,
  createMathNode: CreateMathNode,
) {
  if (!node.isSimpleText() || node.hasFormat("code")) return;
  const parent = node.getParent();
  if (
    !parent ||
    parent.getType() === "code" ||
    parent.getTextContent().includes("$$")
  )
    return;
  if ($isParagraphNode(parent)) {
    let previous = parent.getPreviousSibling();
    while ($isParagraphNode(previous)) {
      const text = previous.getTextContent().trim();
      if (text.endsWith("$$") && !text.startsWith("$$")) break;
      if (text.startsWith("$$")) return;
      previous = previous.getPreviousSibling();
    }
  }
  const match = findInlineMath(node.getTextContent());
  if (!match) return;
  const pieces = node.splitText(match.start, match.end);
  pieces[match.start === 0 ? 0 : 1]?.replace(
    createMathNode(match.equation, true),
  );
}

export function $transformMathParagraph(
  node: ParagraphNode,
  createMathNode: CreateMathNode,
) {
  if (!isPlainParagraph(node)) return;
  const text = node.getTextContent();
  if (!/\$\$\s*$/.test(text)) return;
  const single = findBlockMath(text);
  if (single) {
    node.replace(createMathNode(single, false));
    return;
  }
  const paragraphs = [node];
  let previous = node.getPreviousSibling();
  while ($isParagraphNode(previous) && isPlainParagraph(previous)) {
    paragraphs.unshift(previous);
    if (/^\s*\$\$/.test(previous.getTextContent())) {
      const equation = findBlockMath(
        paragraphs.map((paragraph) => paragraph.getTextContent()).join("\n"),
      );
      if (equation) {
        paragraphs[0]!.replace(createMathNode(equation, false));
        for (const paragraph of paragraphs.slice(1)) paragraph.remove();
      }
      return;
    }
    previous = previous.getPreviousSibling();
  }
}
