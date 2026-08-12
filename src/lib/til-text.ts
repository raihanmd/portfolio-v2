interface TilContentNode {
  type?: string;
  text?: string;
  children?: TilContentNode[];
}

/**
 * Recursively flattens lexical richText JSON into plain text.
 * Code blocks, uploads and relationship nodes contribute nothing so
 * social-card descriptions never start with raw code.
 */
export function extractTilText(content: unknown): string {
  const root = (content as { root?: { children?: TilContentNode[] } } | null)
    ?.root;
  const nodes = root?.children;
  if (!Array.isArray(nodes)) return "";

  return nodes.map(nodeToText).join(" ").replace(/\s+/g, " ").trim();
}

function nodeToText(node: TilContentNode): string {
  if (node.type === "linebreak" || node.type === "tab") return " ";
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.children) || node.children.length === 0) return "";
  // Joining with spaces keeps list items separated; the caller collapses
  // duplicate whitespace afterwards.
  return node.children.map(nodeToText).join(" ");
}

export function truncateText(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
