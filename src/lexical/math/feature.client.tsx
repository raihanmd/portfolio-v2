"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  ParagraphNode,
  TextNode,
  type LexicalEditor,
  type NodeKey,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@payloadcms/richtext-lexical/lexical/react/useLexicalEditable";
import { useEffect, useState } from "react";
import { MathDisplay } from "./math-display";
import { $isMathNode, MathNode, type SerializedMathNode } from "./math-node";
import { $transformMathParagraph, $transformMathText } from "./transform";
import "./math-editor.css";

function MathEditor({
  editor,
  nodeKey,
  equation,
  inline,
}: {
  editor: LexicalEditor;
  nodeKey: NodeKey;
  equation: string;
  inline: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(equation);
  const editable = useLexicalEditable();
  useEffect(() => setValue(equation), [equation]);

  if (!editable) return <MathDisplay equation={equation} inline={inline} />;

  if (editing) {
    return (
      <textarea
        aria-label="Edit LaTeX equation"
        autoFocus
        className="math-editor-field"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.key === "Escape") {
            setValue(equation);
            setEditing(false);
          }
        }}
        onBlur={() => {
          editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isMathNode(node) && editor.isEditable()) {
              if (value.trim()) node.setEquation(value);
              else node.remove();
            }
          });
          setEditing(false);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      aria-label="Edit equation"
      className="math-editor-button"
      onClick={() => setEditing(true)}
    >
      <MathDisplay equation={equation} inline={inline} />
    </button>
  );
}

export class ClientMathNode extends MathNode {
  static importJSON(node: SerializedMathNode) {
    return $createClientMathNode(node.equation, node.inline);
  }

  decorate(editor: LexicalEditor) {
    return (
      <MathEditor
        editor={editor}
        nodeKey={this.getKey()}
        equation={this.getEquation()}
        inline={this.isInline()}
      />
    );
  }
}

function $createClientMathNode(equation: string, inline: boolean) {
  return $applyNodeReplacement(new ClientMathNode(equation, inline));
}

export function MathPlugin() {
  const [editor] = useLexicalComposerContext();
  const editable = useLexicalEditable();

  useEffect(() => {
    if (!editable) return;
    const removeTextTransform = editor.registerNodeTransform(
      TextNode,
      (node) => {
        if (!editor.isComposing())
          $transformMathText(node, $createClientMathNode);
      },
    );

    const removeParagraphTransform = editor.registerNodeTransform(
      ParagraphNode,
      (node) => {
        if (!editor.isComposing())
          $transformMathParagraph(node, $createClientMathNode);
      },
    );

    return () => {
      removeTextTransform();
      removeParagraphTransform();
    };
  }, [editor, editable]);
  return null;
}

export const MathFeatureClient = createClientFeature({
  nodes: [ClientMathNode],
  plugins: [{ Component: MathPlugin, position: "normal" }],
});
