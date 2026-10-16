# Learning Progress

No learning events recorded yet.

## Blog data and publishing

### Demonstrated understanding
- Described an admin-to-public flow using Payload's draft/published status and a public listing restricted to published articles.
- Proposed separate category and series tables with optional relations, an automatically generated slug, a required image, and a TIL-like content editor.
- Proposed numeric auto-increment IDs and cursor pagination for the public listing.
- Specified a 10-article page and resetting to the first batch when category or series changes.
- Chose publication time, rather than creation time, as the public listing order.
- Chose an immutable first-publication timestamp; edits and republication do not change it.
- Scoped public search to blog titles only.
- Requested title-derived automatic slugs, with a short random suffix only when the base slug collides; slug duplication must be prevented.
- Chose slug regeneration while the article is a draft, then a stable slug after first publication to preserve the public URL.
- Described series as a journey or step-by-step tutorial; selecting a series should switch the listing into a series-specific layout rather than merely narrow the generic cards.
- Chose Payload's orderable Join for drag-and-drop management of article order within a series, accepting its experimental status in the installed Payload version.
- Proposed a separate control to switch the entire `/blog` layout into a series discovery view. Series are ordered by the first publication time of their first published article; the view initially emphasizes the newest series while retaining a directory of all series. Series-mode search should match series names and article titles.
- Rejected a separate series page and prefers series discovery and selection to remain within `/blog`, treating series as a grouping of ordinary blog articles.
- Confirmed that selecting a series shows its article list on `/blog`, and every individual article opens `/blog/[slug]` regardless of series membership.
- Specified two date-based orders: the series directory is descending by each series' earliest published article timestamp; articles within a selected series are descending by each article's own first-publication timestamp.
- Removed the earlier orderable Join choice after recognizing that publication time fully determines the public article order.
- Agreed to contextual filter controls: Articles mode retains title search plus Category and Series dropdowns; Series mode uses its visible directory as selector and searches series names or article titles.
- Chose the existing Payload media manager for blog cover and in-content images rather than a separate media collection.
- Chose automatic extraction of short descriptions from article content for list cards and SEO/social metadata instead of a separately authored summary.
- Confirmed a landscape OG card composed of about 70% uploaded cover image and 30% title panel, with a small site label and title capped at two lines; image loading needs a branded fallback.
- Revised the cover requirement from mandatory to optional. If present, the cover appears first on article detail; image-less articles start with text. Series can represent a learning journal as well as a staged tutorial.
- Accepted a single-column editorial article list with consistent text and separators, plus an optional thumbnail on the right and no empty image placeholder.
- Chose text-only Series presentation with a name and optional admin-authored description; no dedicated series image.
- Chose Series-mode search results that show both the matching series and the matching article title.

### Introduced
- Cursor pagination must be tied to a stable sort order, especially when search and filters can change the result set.
- Explained that changing a published article's slug changes its URL; keeping the slug stable preserves existing links, while deliberate URL changes need redirects and canonical updates for search engines.
- Researched two ways to order a series: an explicit numeric position on each blog article, or Payload's orderable Join field on the Series collection. The latter supports drag-and-drop but is marked experimental in the installed Payload 3.87.1 types. No option chosen yet.
- Proposed contextual filtering: retain the Series dropdown in Articles mode; use the visible series directory as the selector in Series mode, with a search that matches series names and article titles. This proposal has not been confirmed.
- Evaluated the learner's proposed social preview composition: about 70% cover image and 30% title/footer at a landscape social-card size. Suggested a two-line title cap and a restrained site label; not yet confirmed.

### Needs reinforcement
- Cursor details, search reset behavior, and production-safe schema migration need concrete design. The AI has proposed additions but none are confirmed yet.

## Blog design confirmation

### Chosen design
- The learner confirmed the blog design summary covering CMS data, Articles and Series views, slug stability, date ordering, optional images, social preview composition, and the AI's listed additions: composite cursor, reset on search/mode changes, hidden empty series, TIL-style admin-only views, SEO metadata, and a migration plan that prevents automatic schema push to the production database.

## Implementation and production migration
- The learner approved the proposed implementation scope for the blog, including application code and preparation of an additive migration. Applying a migration to the production database was not part of that approval.
- The learner chose a separate `blog-media` Payload upload collection for blog images while keeping the same Supabase S3 bucket and credentials, with a `blogs/` prefix. The AI explained that the Payload collection is the admin-managed catalog and the bucket stores the file bytes.
- Implemented collection configs, S3 prefix, public blog routes and filters, detail, views, OG, SEO, generated Payload types, and an additive migration file. `push: false` now prevents dev schema push.
- The initial read-only production check found project tables, no blog tables, and only the old `dev` migration marker. The dedicated script passed its preflight before applying the migration.
- On 2026-10-15, the learner explicitly approved applying the production migration. `bun scripts/apply-blog-migration.ts --apply` succeeded. A read-only follow-up confirmed both migration records, all five blog tables, and the published-cursor index; `blogs` had zero rows. The one-time script now rejects the changed baseline if run again.
- Scoped static checks passed: TypeScript, Next lint, Prettier on changed code, and `git diff --check`. No build was run per the learner's instruction. Before migration, a separate dev server rendered `/til` and `/projects` without client console errors; TIL modal text rendered and had no horizontal overflow; navbar fit a 320 px viewport.
- After migration, a local dev server with schema push disabled returned 200 for `/blog`, its Series and search variants, `/til`, `/projects`, and the Blogs, Blog Categories, and Blog Series REST list endpoints. The browser showed the Articles and Series empty states without console errors or horizontal overflow. An unknown article displayed the custom 404 page. Published article rendering, media loading, filters with real records, view tracking, and OG preview remain unverified because the production blog collections contain no content.
