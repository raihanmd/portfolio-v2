# TIL direct detail

## Sub-features

- Published note at `/til/<date-slug>` with rich text, uploaded media, share control, metadata, and a per-session view counter.
- Legacy cuid URLs redirect to the canonical slug. Draft edits do not appear publicly until published.

## How to get to it (user POV)

Open a published note from `/til` in a new tab or load its URL directly. The standalone page is separate from the intercepted feed modal.

## Driving it with Chromium Playwright

1. For a read-only production check, use an HTTP GET for `/api/tils?where[slug][equals]=<slug>&depth=1` and `/til/<slug>`. Compare a distinctive published text fragment and media URL in the API response and HTML; require status 200 and `Cache-Control` containing `no-store`.
2. On an isolated database, navigate directly in the browser, inspect the image's `complete` and `naturalWidth`, and check the 390px viewport has no horizontal overflow. Verify Back and Share controls remain usable.
3. If the admin shows newer text than the public page, compare the latest version status with the published main row before changing cache settings.

## Gotchas

- The route is `force-dynamic`; the direct server response is fresh, but Next's client Router Cache can reuse a page during back/forward navigation. A hard refresh clears client cache.
- `src/lib/query-til.ts` selectively populates `project-media` upload nodes. The OG image route only needs plain text and does not populate uploads.
- `src/collections/tils.ts` preserves the existing slug on partial content updates when the date is unchanged. After any authorized content restoration, verify both the upload and the original canonical URL.
- Browser visits may change the `views` counter after 1.5 seconds. Do not use them as read-only production probes.
