import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { fetchTilFast } from "~/lib/query-til";
import { formatTilDate } from "~/lib/til-date";
import { extractTilText, truncateText } from "~/lib/til-text";

export const alt = "Today I Learned by Raihanmd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const FONT_DIR = path.join(process.cwd(), "public", "fonts");
// PNG (not webp): @vercel/og's bundled resvg can't decode webp, it crashes.
const LOGO_PATH = path.join(process.cwd(), "public", "favicon.png");

async function loadFonts() {
  try {
    // Static TTFs (not woff2/variable): satori's parser rejects both woff2 and
    // variable-font fvar tables, so the fonts live as static ttf in public/fonts.
    const [archivo400, archivo700, newsreader400] = await Promise.all([
      readFile(path.join(FONT_DIR, "archivo-400.ttf")),
      readFile(path.join(FONT_DIR, "archivo-700.ttf")),
      readFile(path.join(FONT_DIR, "newsreader-400.ttf")),
    ]);
    return [
      {
        name: "Archivo",
        data: archivo400,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Archivo",
        data: archivo700,
        weight: 700 as const,
        style: "normal" as const,
      },
      {
        name: "Newsreader",
        data: newsreader400,
        weight: 400 as const,
        style: "normal" as const,
      },
    ];
  } catch {
    // Fall back to satori's default font if the font files are unavailable.
    return [];
  }
}

// Read once per server instance instead of on every image request.
const fontsPromise = loadFonts();

async function loadLogo(): Promise<string | null> {
  try {
    const buffer = await readFile(LOGO_PATH);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

const logoPromise = loadLogo();

interface OpenGraphImageProps {
  params: Promise<{ id: string }>;
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params;

  const til = await fetchTilFast(id);

  const dateLabel = til ? formatTilDate(til.date) : "Today I Learned";
  const snippet = til ? truncateText(extractTilText(til.content), 120) : "";
  const [fonts, logo] = await Promise.all([fontsPromise, logoPromise]);

  const response = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "52px 64px",
        backgroundColor: "#09090b", // site dark background (zinc-950)
        fontFamily: "Archivo",
      }}
    >
      {/* Aurora glows — site's blue/indigo/violet palette */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -160,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.20), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -220,
          left: -140,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.24), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "44%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14), transparent 70%)",
        }}
      />

      {/* Faint grid lines (site's bg-grid-white[0.02]) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            style={{
              height: "100%",
              width: 1,
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          />
        ))}
      </div>

      {/* Top bar: favicon logo + Today I Learned */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
        }}
      >
        {logo ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "#fafafa", // light chip so the dark "R" mark pops
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={30} height={30} />
          </div>
        ) : (
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              backgroundColor: "#22d3ee",
            }}
          />
        )}
        <span
          style={{
            fontSize: 15,
            fontWeight: 400,
            letterSpacing: "0.3em",
            color: "#71717a",
          }}
        >
          TODAY I LEARNED
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#22d3ee",
            marginBottom: 20,
          }}
        >
          {`TIL  ·  ${dateLabel}`}
        </div>
        {snippet && (
          <div
            style={{
              fontSize: 38,
              lineHeight: 1.45,
              fontWeight: 400,
              fontFamily: "Newsreader",
              color: "#d4d4d8",
              maxWidth: 960,
            }}
          >
            {snippet}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "#a1a1aa",
          }}
        >
          raihanmd.xyz
        </span>
      </div>
    </div>,
    { ...size, fonts },
  );

  // Cache at the CDN/proxy layer so crawlers and repeat fetches hit a fast copy
  // instead of waiting for an on-demand render every time.
  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
  );

  return response;
}
