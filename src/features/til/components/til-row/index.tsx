"use client";

import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type {
  JSXConverterArgs,
  JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import AnimateItem from "~/_components/animate-item";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import type { Til } from "../../../../../payload-types";
import CodeBlock from "../code-block";

interface TilRowProps {
  til: Til;
}

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

function formatTilDate(dateString: string): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString));
  return formatted.replace(",", "").toUpperCase();
}

export default function TilRow({ til }: TilRowProps) {
  return (
    <AnimateItem>
      <Card className="-mx-0 overflow-hidden border border-dashed border-border bg-muted/30 transition-all hover:shadow-lg">
      <CardHeader className="p-4 pb-2 md:p-5 md:pb-2">
        <time
          dateTime={til.date}
          className="font-mono text-xs uppercase leading-4 tracking-wider text-muted-foreground"
        >
          {formatTilDate(til.date)}
        </time>
      </CardHeader>
      <CardContent className="p-4 pt-0 md:p-5 md:pt-0">
        <RichText
          data={til.content}
          converters={jsxConverters}
          className="til-prose text-base leading-relaxed text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-muted [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
        />
      </CardContent>
      </Card>
    </AnimateItem>
  );
}
