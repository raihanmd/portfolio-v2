import {
  $applyNodeReplacement,
  DecoratorNode,
  type EditorConfig,
  type LexicalNode,
  type LexicalEditor,
  type NodeKey,
  type SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";
import type { ReactNode } from "react";

export type SerializedMathNode = SerializedLexicalNode & {
  equation: string;
  inline: boolean;
};

export class MathNode extends DecoratorNode<ReactNode> {
  __equation: string;
  __inline: boolean;

  constructor(equation: string, inline: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline;
  }

  static getType() {
    return "math";
  }
  static importDOM() {
    return null;
  }
  static clone(node: MathNode) {
    return new this(node.__equation, node.__inline, node.__key);
  }
  static importJSON(node: SerializedMathNode) {
    return $createMathNode(node.equation, node.inline);
  }
  exportJSON(): SerializedMathNode {
    return {
      type: "math",
      version: 1,
      equation: this.getEquation(),
      inline: this.isInline(),
    };
  }
  createDOM(_config: EditorConfig) {
    return document.createElement(this.__inline ? "span" : "div");
  }
  exportDOM() {
    const element = document.createElement(this.__inline ? "span" : "div");
    element.textContent = this.getTextContent();
    return { element };
  }
  updateDOM() {
    return false;
  }
  decorate(_editor: LexicalEditor): ReactNode {
    return null;
  }
  isInline() {
    return this.__inline;
  }
  getEquation() {
    return this.getLatest().__equation;
  }
  getTextContent() {
    const delimiter = this.isInline() ? "$" : "$$";
    return `${delimiter}${this.getEquation()}${delimiter}`;
  }
  setEquation(equation: string) {
    this.getWritable().__equation = equation;
  }
}

export function $createMathNode(equation: string, inline: boolean) {
  return $applyNodeReplacement(new MathNode(equation, inline));
}

export function $isMathNode(
  node: LexicalNode | null | undefined,
): node is MathNode {
  return node instanceof MathNode;
}
