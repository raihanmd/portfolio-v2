# Project Map

## Purpose
Personal engineering portfolio for Raihanmd with content managed in Payload CMS.

## Requirements
- Requested: dedicated blog listing and slug-based detail page, without modal navigation.
- Requested: separate search, category dropdown, and series dropdown on listing.
- Requested: at most one optional category and one optional series per blog.
- Requested: optional blog cover displayed on listing when present, view tracking like TIL, social OG preview, and Notion-like rich block content like TIL.
- Production database contains existing data; avoid unapproved destructive changes. User previously requested not to run a production build while their dev server is running.

## Components
- `payload.config.ts`: Payload collections, PostgreSQL adapter, Lexical editor, Supabase S3 storage for project media.
- `src/collections/tils.ts`: TIL content and view tracking configuration.
- `src/collections/projects.ts`: Project content, categories, and media fields.
- `src/app/(site)/til/page.tsx`: TIL listing page.
- `src/app/(site)/til/[id]/page.tsx`: Direct TIL detail route.
- `src/features/til/`: TIL interface components.
- `src/app/(site)/projects/page.tsx`: Project listing route.

## Main Flow
Verified existing: Payload admin -> Payload PostgreSQL collections -> site routes and feature components. TIL listing/detail and Projects listing use separate route and component paths. Learner-chosen blog flow: admin creates draft or published article with title, optional category and series relations, optional cover image from the dedicated `blog-media` manager, automatic title-derived unique slug with a short random suffix only on collision, and TIL-like content -> public `/blog` shows published articles only, sorted by first publication time, 10 per cursor page -> slug detail. When present, the cover precedes the title on detail; image-less articles start with text. Category, series, search, or mode changes reset pagination. Publication time does not change on edits or republication. Search matches titles only. Slug follows the title during draft and freezes after first publication. A separate control switches `/blog` to a series discovery layout, emphasizing the newest series by its earliest published article while retaining all series. Series may be journals or tutorial journeys. Search there matches series names and article titles. Search results show both matched series and matched article titles. Selecting a series shows its articles on `/blog`, newest published article first; every article opens `/blog/[slug]`. No manual series ordering is needed. Articles mode keeps title search plus Category and Series dropdowns; Series mode uses its directory for selection and searches series names/article titles.

## Data and Trust Boundaries
Payload uses PostgreSQL via `DATABASE_URL`. Project media and blog media use separate Payload upload collections and prefixes (`projects/`, `blogs/`) in the same S3-compatible Supabase bucket and credentials. Blog media is image-only; cover and inline images use it. Public queries return only published articles. No credentials recorded here.

## Build and Deployment
`package.json` has Bun-oriented Next.js 15.4 scripts: `bun run dev`, `bun run build`, `bun run lint`, `bun run start`. `payload.config.ts` uses the PostgreSQL adapter. Deployment details for this task have not been verified.

## Unknowns
- The confirmed design uses a composite `(publishedAt, id)` cursor, resets pagination on search/mode changes, hides series with no published articles, tracks admin-only views as TIL does, and includes canonical/sitemap/BlogPosting JSON-LD/OG. Article list uses editorial rows with optional right thumbnails; descriptions derive from content; OG cards use a 70/30 cover/title composition when a cover exists and a text-only fallback otherwise. The adapter is now configured with `push: false` to prevent automatic development schema changes; the additive blog migration was generated but has not been applied to production.
- Learner experience/preferences; learner knows the repo overall but is less familiar with Payload CMS integration. Learning scope is a mix of overall flow and changed-area details.
