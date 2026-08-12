import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import { getPayload } from "payload";

import config from "../../../../../payload.config";
import type { Til } from "../../../../../payload-types";
import { formatTilDate } from "~/lib/til-date";
import { extractTilText, truncateText } from "~/lib/til-text";

export const alt = "Today I Learned by Raihanmd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const FONT_DIR = path.join(process.cwd(), "node_modules/@fontsource-variable");

async function loadFonts() {
  try {
    const [archivo, newsreader] = await Promise.all([
      readFile(
        path.join(FONT_DIR, "archivo/files/archivo-latin-wght-normal.woff2"),
      ),
      readFile(
        path.join(
          FONT_DIR,
          "newsreader/files/newsreader-latin-wght-normal.woff2",
        ),
      ),
    ]);
    return [
      {
        name: "Archivo",
        data: archivo,
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Archivo",
        data: archivo,
        weight: 700 as const,
        style: "normal" as const,
      },
      {
        name: "Newsreader",
        data: newsreader,
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

interface OpenGraphImageProps {
  params: Promise<{ id: string }>;
}

export default async function OpenGraphImage({
  params,
}: OpenGraphImageProps) {
  const { id } = await params;

  const payload = await getPayload({ config });
  let til: Til | null = null;
  try {
    til = await payload.findByID({
      collection: "tils",
      id,
      depth: 0,
    });
  } catch {
    til = null;
  }

  const dateLabel = til ? formatTilDate(til.date) : "Today I Learned";
  const snippet = til
    ? truncateText(extractTilText(til.content), 120)
    : "";
  const fonts = await fontsPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          backgroundColor: "#0c0c0e",
          fontFamily: "Archivo",
        }}
      >
        {/* Decorative gradient glows */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.22), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.28), transparent 70%)",
          }}
        />
        {/* Faint grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            />
          ))}
        </div>

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                backgroundColor: "#22d3ee",
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#e4e4e7",
              }}
            >
              RAIHANMD
            </span>
          </div>
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
            TIL&nbsp;&nbsp;·&nbsp;&nbsp;{dateLabel}
          </div>
          {snippet && (
            <div
              style={{
                fontSize: 38,
                lineHeight: 1.45,
                fontWeight: 400,
                fontFamily: "Newsreader",
                color: "#d4d4d8",
                maxWidth: 940,
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
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: "#52525b",
            }}
          >
            RAIHANMD.DEV
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: "#52525b",
            }}
          >
            SOFTWARE ENGINEER &amp; WEB3 DEVELOPER
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
