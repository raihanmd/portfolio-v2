"use client";

/* eslint-disable @next/next/no-img-element -- CMS images use arbitrary S3 URLs and responsive picture sources. */

import type {
  SerializedBlockNode,
  SerializedUploadNode,
} from "@payloadcms/richtext-lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type {
  JSXConverterArgs,
  JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";

import type { Til } from "../../payload-types";
import CodeBlock from "~/_components/code-block";

interface UploadImageSize {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filesize?: number | null;
  filename?: string | null;
}

interface UploadDocument {
  alt?: string | null;
  caption?: string | null;
  filename?: string | null;
  height?: number | null;
  mimeType?: string | null;
  sizes?: Record<string, UploadImageSize | null>;
  url?: string | null;
  width?: number | null;
}

function imageWithCaption(node: SerializedUploadNode) {
  const uploadDoc =
    typeof node.value === "object" && node.value !== null
      ? (node.value as unknown as UploadDocument)
      : null;
  if (!uploadDoc?.url || !uploadDoc.mimeType?.startsWith("image")) return null;

  const nodeFields = node.fields as Record<string, unknown> | undefined;
  const alt =
    typeof nodeFields?.alt === "string"
      ? nodeFields.alt
      : (uploadDoc.alt ?? "");
  const caption =
    typeof nodeFields?.caption === "string"
      ? nodeFields.caption.trim()
      : (uploadDoc.caption?.trim() ?? "");

  const image =
    uploadDoc.sizes && Object.keys(uploadDoc.sizes).length > 0 ? (
      <picture>
        {Object.entries(uploadDoc.sizes).map(([name, size]) =>
          size?.url && size.width && size.mimeType ? (
            <source
              key={name}
              media={`(max-width: ${size.width}px)`}
              srcSet={size.url}
              type={size.mimeType}
            />
          ) : null,
        )}
        <img
          alt={alt}
          height={uploadDoc.height ?? undefined}
          src={uploadDoc.url}
          width={uploadDoc.width ?? undefined}
        />
      </picture>
    ) : (
      <img
        alt={alt}
        height={uploadDoc.height ?? undefined}
        src={uploadDoc.url}
        width={uploadDoc.width ?? undefined}
      />
    );

  if (!caption) return image;

  return (
    <figure>
      {image}
      <figcaption className="text-center text-xs italic text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: (args: JSXConverterArgs<SerializedUploadNode>) =>
    imageWithCaption(args.node) ??
    (typeof defaultConverters.upload === "function"
      ? defaultConverters.upload(args)
      : defaultConverters.upload),
  blocks: {
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

const proseClasses =
  "til-prose text-base leading-relaxed text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:bg-muted [&_code:not(pre_code)]:px-1 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-sm [&_figure]:my-4 [&_figure_img]:my-0 [&_figcaption]:mt-1 [&_h1]:my-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:my-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:my-2 [&_h4]:text-base [&_h4]:font-semibold [&_h5]:my-2 [&_h5]:text-sm [&_h5]:font-semibold [&_h6]:my-2 [&_h6]:text-sm [&_h6]:font-semibold [&_hr]:my-4 [&_hr]:border-border [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-1.5 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul.list-check]:list-none [&_ul.list-check]:pl-0";

export default function RichContent({ content }: { content: Til["content"] }) {
  return (
    <RichText data={content} converters={converters} className={proseClasses} />
  );
}
