import { createId } from "@paralleldrive/cuid2";
import {
  BlocksFeature,
  CodeBlock,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig, FieldHook } from "payload";

import { getTilViews, incrementTilView } from "../lib/query-til";

interface TilSlugHookData {
  id: string;
  date?: unknown;
  slug?: string | null;
}

/**
 * Generates the date-based slug (e.g. `2026-08-12`), formatted from the UTC
 * date so it always matches the date shown by formatTilDate. If two TILs share
 * a day the second one gets `2026-08-12-2`, `-3`, … — the unique index needs
 * a suffix, but the base stays the pure date.
 *
 * No self-exclusion is needed: when the date is unchanged we keep the existing
 * slug, and when it changed the old slug can't start with the new base, so the
 * current doc never appears in its own `like` result set.
 */
const generateSlug: FieldHook<TilSlugHookData> = async ({ data, req }) => {
  const dateValue = data?.date;
  if (!dateValue) return data?.slug ?? "";

  let base: string;
  try {
    base = new Date(dateValue as string).toISOString().slice(0, 10);
  } catch {
    return data?.slug ?? "";
  }

  // Date unchanged — keep the existing slug so every autosave doesn't churn it.
  const current = data?.slug;
  if (typeof current === "string" && current.startsWith(base)) return current;

  try {
    const result = await req.payload.find({
      collection: "tils",
      overrideAccess: true,
      draft: true,
      limit: 100,
      where: {
        slug: { like: `${base}%` },
      },
      select: { slug: true },
    });

    const taken = new Set(
      result.docs
        .map((doc) => (doc as { slug?: string | null }).slug)
        .filter((slug): slug is string => typeof slug === "string"),
    );

    let candidate = base;
    let suffix = 2;
    while (taken.has(candidate)) {
      candidate = `${base}-${suffix++}`;
    }
    return candidate;
  } catch {
    // Lookup failed — fall back to the plain date slug.
    return base;
  }
};

// Fixed-window in-memory rate limit for the view endpoint. Generous for
// humans (a session fires 1 hit), tight enough to blunt bots hammering the
// counter. The deploy is a single Docker instance, so per-instance state is
// fine; expired entries are swept once the map grows past a threshold.
const VIEW_RATE_LIMIT = {
  windowMs: 60_000,
  maxPerIpPerTil: 20, // 20 view hits / min for the same (IP, TIL)
  maxPerIp: 120, // 120 view hits / min per IP across all TILs
};

const viewHits = new Map<string, { count: number; resetAt: number }>();

function checkViewRateLimit(key: string, max: number, now: number): boolean {
  const entry = viewHits.get(key);
  if (!entry || entry.resetAt <= now) {
    viewHits.set(key, { count: 1, resetAt: now + VIEW_RATE_LIMIT.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export const Tils: CollectionConfig = {
  slug: "tils",
  admin: {
    useAsTitle: "date",
    // Show the counter + slug in the admin list view (views is admin-only).
    defaultColumns: ["date", "slug", "views"],
    listSearchableFields: ["slug"],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Custom string id (cuid2) instead of the autoincrement integer.
        if (operation === "create" && data && !data.id) {
          data.id = createId();
        }
        return data;
      },
    ],
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        // The view counter is authoritative (raw-SQL increments bypass Payload),
        // and the admin form loads `views` from the version snapshot — which is
        // stale (0). Never let a save overwrite the counter with that stale
        // value; write the live DB value instead so the new snapshot also
        // carries the correct count. New snapshots + main table stay in sync.
        const tilId = (originalDoc as { id?: string } | undefined)?.id;
        if (operation === "update" && data && tilId) {
          data.views = (await getTilViews(tilId)) ?? 0;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      index: true,
    },
    {
      // Auto-generated from the date — admin read-only. Old docs have NULL
      // until the backfill SQL is run; feed links fall back to the cuid id.
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "Auto-generated from the date (e.g. 2026-08-12). Not editable.",
      },
      hooks: {
        beforeValidate: [generateSlug],
      },
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [CodeBlock()],
          }),
        ],
      }),
      required: true,
    },
    {
      // Readable only by authenticated users: visible in the Payload admin,
      // excluded from the public REST/GraphQL responses (feed, etc.).
      name: "views",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Total page views (counted when the TIL page is opened).",
      },
      access: {
        read: ({ req }) => Boolean(req.user),
      },
    },
  ],
  endpoints: [
    {
      // POST /api/tils/:id/view — fired client-side once per TIL per session.
      path: "/:id/view",
      method: "post",
      handler: async (req) => {
        const id = req.routeParams?.id;
        if (typeof id !== "string" || !id) {
          return Response.json({ error: "Missing TIL id" }, { status: 400 });
        }

        // Best-effort client IP from the reverse proxy; falls back to a shared
        // "unknown" bucket when the header is absent (safe, just stricter).
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
        const now = Date.now();

        if (viewHits.size > 10_000) {
          for (const [key, entry] of viewHits) {
            if (entry.resetAt <= now) viewHits.delete(key);
          }
        }
        const limited =
          checkViewRateLimit(`${ip}:${id}`, VIEW_RATE_LIMIT.maxPerIpPerTil, now) ||
          checkViewRateLimit(ip, VIEW_RATE_LIMIT.maxPerIp, now);
        if (limited) {
          return Response.json(
            { error: "Too many requests" },
            { status: 429, headers: { "Retry-After": "60" } },
          );
        }

        const views = await incrementTilView(id);
        if (views === null) {
          return Response.json({ error: "TIL not found" }, { status: 404 });
        }
        return Response.json({ ok: true, views });
      },
    },
  ],
};
