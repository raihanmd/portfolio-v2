"use client";

import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type {
  JSXConverterArgs,
  JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import type { Til } from "../../../../../payload-types";
import CodeBlock from "../code-block";

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    // The premade CodeBlock from @payloadcms/richtext-lexical serializes as
    // { type: "block", blockType: "Code", fields: { language, code } }.
    Code: (args: JSXConverterArgs<SerializedBlockNode>) => {
      const fields = args.node.fields as Record<string, unknown>;
      return (
        <CodeBlock
          code={typeof fields.code === "string" ? fields.code : ""}
          language={
            typeof fields.language === "string" ? fields.language : "plaintext"
          }
        />
      );
    },
  },
});

const TIL_PROSE_CLASSES =
  "til-prose text-base leading-relaxed text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-muted [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:text-base [&_h4]:font-semibold [&_h5]:my-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h6]:my-2 [&_h6]:text-sm [&_h6]:font-semibold [&_hr]:my-4 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul.list-check]:list-none [&_ul.list-check]:pl-0";

interface TilRichTextProps {
  til: Til;
  className?: string;
}

export default function TilRichText({ til, className }: TilRichTextProps) {
  return (
    <RichText
      data={til.content}
      converters={jsxConverters}
      className={className ?? TIL_PROSE_CLASSES}
    />
  );
}
