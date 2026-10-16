import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import sharp from "sharp";

import { getBlogBySlug } from "~/lib/query-blog";
import { truncateText } from "~/lib/til-text";

export const alt = "Blog by Raihanmd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const fontDirectory = path.join(process.cwd(), "public", "fonts");
const fontsPromise = Promise.all([
  readFile(path.join(fontDirectory, "archivo-700.ttf")),
  readFile(path.join(fontDirectory, "archivo-400.ttf")),
]).then(([bold, regular]) => [
  {
    name: "Archivo",
    data: bold,
    weight: 700 as const,
    style: "normal" as const,
  },
  {
    name: "Archivo",
    data: regular,
    weight: 400 as const,
    style: "normal" as const,
  },
]);

async function coverDataURL(url: string | null): Promise<string | null> {
  const publicBase = process.env.SUPABASE_STORAGE_PUBLIC_URL?.replace(
    /\/$/,
    "",
  );
  if (!url || !publicBase || !url.startsWith(`${publicBase}/blogs/`))
    return null;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const contentLength = Number(response.headers.get("content-length"));
    if (contentLength > 12 * 1024 * 1024) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > 12 * 1024 * 1024) return null;
    const image = await sharp(buffer)
      .resize(1200, 441, { fit: "cover" })
      .png()
      .toBuffer();
    return `data:image/png;base64,${image.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) notFound();
  const [fonts, cover] = await Promise.all([
    fontsPromise.catch(() => []),
    coverDataURL(article.coverCardURL ?? article.coverURL),
  ]);
  const title = truncateText(article.title, cover ? 70 : 90);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontFamily: "Archivo",
      }}
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          width={1200}
          height={441}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: 240,
            background: "linear-gradient(120deg, #18181b, #1e293b)",
            borderBottom: "1px solid #27272a",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          padding: "24px 64px",
          borderTop: cover ? "1px solid #27272a" : "none",
        }}
      >
        <span
          style={{ fontSize: 15, letterSpacing: "0.25em", color: "#a1a1aa" }}
        >
          RAIHANMD · BLOG
        </span>
        <span
          style={{
            marginTop: 12,
            fontSize: cover ? 47 : 64,
            fontWeight: 700,
            fontFamily: "Archivo",
            lineHeight: 1.1,
            overflow: "hidden",
          }}
        >
          {title}
        </span>
      </div>
    </div>,
    {
      ...size,
      fonts,
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
