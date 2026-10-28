import assert from "node:assert/strict";
import { test } from "node:test";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  ParagraphNode,
  TextNode,
} from "@payloadcms/richtext-lexical/lexical";
import { createHeadlessEditor } from "@payloadcms/richtext-lexical/lexical/headless";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MathDisplay } from "./math-display";
import { $createMathNode, MathNode } from "./math-node";
import { findInlineMath } from "./parse";
import { $transformMathParagraph, $transformMathText } from "./transform";

function transform(paragraphs: string[], code = false) {
  const editor = createHeadlessEditor({
    namespace: "math-test",
    nodes: [MathNode],
    onError(error) {
      throw error;
    },
  });
  editor.registerNodeTransform(TextNode, (node) =>
    $transformMathText(node, $createMathNode),
  );
  editor.registerNodeTransform(ParagraphNode, (node) =>
    $transformMathParagraph(node, $createMathNode),
  );
  editor.update(
    () => {
      for (const text of paragraphs) {
        const node = $createTextNode(text);
        if (code) node.toggleFormat("code");
        $getRoot().append($createParagraphNode().append(node));
      }
    },
    { discrete: true },
  );
  return editor.getEditorState().toJSON().root.children;
}

void test("converts inline equations while preserving surrounding text", () => {
  const paragraph = transform(["Vector $x^2$ and $y$"])[0] as unknown as {
    children: Array<{
      type: string;
      equation?: string;
      inline?: boolean;
      text?: string;
    }>;
  };
  assert.deepEqual(
    paragraph.children.map(({ type, equation, text }) => [
      type,
      equation ?? text,
    ]),
    [
      ["text", "Vector "],
      ["math", "x^2"],
      ["text", " and "],
      ["math", "y"],
    ],
  );
  assert.equal(paragraph.children[1]?.inline, true);
});

void test("converts multiline and single paragraph display equations", () => {
  for (const paragraphs of [
    ["$$", "x^2 + y^2", "= z^2", "$$"],
    ["$$x^2 + y^2\n= z^2$$"],
  ]) {
    const nodes = transform(paragraphs) as Array<{
      type: string;
      equation?: string;
      inline?: boolean;
    }>;
    assert.equal(nodes.length, 1);
    assert.equal(nodes[0]?.type, "math");
    assert.equal(nodes[0]?.equation, "x^2 + y^2\n= z^2");
    assert.equal(nodes[0]?.inline, false);
  }
});

void test("keeps surrounding paragraphs and restores serialized math", () => {
  const children = transform(["Introduction", "$$", "x+y", "$$", "Conclusion"]);
  assert.deepEqual(
    children.map((node) => node.type),
    ["paragraph", "math", "paragraph"],
  );
  const editor = createHeadlessEditor({
    namespace: "math-roundtrip-test",
    nodes: [MathNode],
    onError(error) {
      throw error;
    },
  });
  const state = editor.parseEditorState(
    JSON.stringify({
      root: {
        children,
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    }),
  );
  editor.setEditorState(state);
  assert.deepEqual(editor.getEditorState().toJSON().root.children, children);
});

void test("leaves currency, escaped dollars and code unchanged", () => {
  assert.equal(findInlineMath("Costs $5 and $10"), null);
  assert.equal(findInlineMath("\\$x$"), null);
  const paragraph = transform(["$x$"], true)[0] as unknown as {
    children: Array<{ type: string; text?: string }>;
  };
  assert.equal(paragraph.children[0]?.type, "text");
  assert.equal(paragraph.children[0]?.text, "$x$");
});

void test("typing can continue after an inline equation", () => {
  const editor = createHeadlessEditor({
    namespace: "math-typing-test",
    nodes: [MathNode],
    onError(error) {
      throw error;
    },
  });
  editor.registerNodeTransform(TextNode, (node) =>
    $transformMathText(node, $createMathNode),
  );
  editor.update(
    () => {
      const paragraph = $createParagraphNode();
      $getRoot().append(paragraph);
      paragraph.selectEnd();
    },
    { discrete: true },
  );
  for (const character of "Start $x$ end") {
    editor.update(
      () => {
        const selection = $getSelection();
        assert.ok($isRangeSelection(selection));
        selection.insertText(character);
      },
      { discrete: true },
    );
  }
  const paragraph = editor.getEditorState().toJSON().root
    .children[0] as unknown as {
    children: Array<{ type: string; text?: string; equation?: string }>;
  };
  assert.deepEqual(
    paragraph.children.map(({ type, text, equation }) => [
      type,
      text ?? equation,
    ]),
    [
      ["text", "Start "],
      ["math", "x"],
      ["text", " end"],
    ],
  );
});

void test("typing a multiline equation preserves a place to continue", () => {
  const editor = createHeadlessEditor({
    namespace: "math-block-typing-test",
    nodes: [MathNode],
    onError(error) {
      throw error;
    },
  });
  editor.registerNodeTransform(TextNode, (node) =>
    $transformMathText(node, $createMathNode),
  );
  editor.registerNodeTransform(ParagraphNode, (node) =>
    $transformMathParagraph(node, $createMathNode),
  );
  editor.update(
    () => {
      const paragraph = $createParagraphNode();
      $getRoot().append(paragraph);
      paragraph.selectEnd();
    },
    { discrete: true },
  );
  for (const character of "$$\nx^2\n$$") {
    editor.update(
      () => {
        const selection = $getSelection();
        assert.ok($isRangeSelection(selection));
        if (character === "\n") selection.insertParagraph();
        else selection.insertText(character);
      },
      { discrete: true },
    );
  }
  editor.update(
    () => {
      const selection = $getSelection();
      assert.ok($isRangeSelection(selection));
      selection.insertParagraph();
      const next = $getSelection();
      assert.ok($isRangeSelection(next));
      next.insertText("After");
    },
    { discrete: true },
  );
  const children = editor.getEditorState().toJSON().root.children;
  assert.deepEqual(
    children.map((node) => node.type),
    ["math", "paragraph"],
  );
  assert.equal(
    editor.getEditorState().read(() => $getRoot().getTextContent()),
    "$$x^2$$After",
  );
});

void test("typing a currency range does not create an equation", () => {
  const editor = createHeadlessEditor({
    namespace: "math-currency-test",
    nodes: [MathNode],
    onError(error) {
      throw error;
    },
  });
  editor.registerNodeTransform(TextNode, (node) =>
    $transformMathText(node, $createMathNode),
  );
  editor.update(
    () => {
      const paragraph = $createParagraphNode();
      $getRoot().append(paragraph);
      paragraph.selectEnd();
    },
    { discrete: true },
  );
  for (const character of "Price $5-$10") {
    editor.update(
      () => {
        const selection = $getSelection();
        assert.ok($isRangeSelection(selection));
        selection.insertText(character);
      },
      { discrete: true },
    );
  }
  const paragraph = editor.getEditorState().toJSON().root
    .children[0] as unknown as {
    children: Array<{ type: string; text?: string }>;
  };
  assert.equal(paragraph.children.length, 1);
  assert.equal(paragraph.children[0]?.text, "Price $5-$10");
});

void test("renders math and safely falls back for invalid LaTeX", () => {
  const math = renderToStaticMarkup(
    createElement(MathDisplay, { equation: "x^2", inline: false }),
  );
  assert.match(math, /katex-display/);
  assert.match(math, /<math/);
  const invalid = renderToStaticMarkup(
    createElement(MathDisplay, {
      equation: "\\badcommand{<script>}",
      inline: true,
    }),
  );
  assert.match(invalid, /&lt;script&gt;/);
  assert.doesNotMatch(invalid, /<script>/);
});
