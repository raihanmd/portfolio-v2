# Projects gallery

## Sub-features

- Published Payload projects at `/projects`, category filters, detail modal, and media carousel with video before images.

## How to get to it (user POV)

Open `/projects`, optionally select a category under `Filter by Category`, then click a project's `Details` button. The modal shows the project's title, description, media, categories, and links.

## Driving it with Chromium Playwright

1. Record the initial `Showing N of M projects` text and visible titles. Select a category button and confirm the result count and cards change; use `Clear All` to restore the list.
2. Pick a published project with media from `/api/projects?depth=2`, click the `Details` button inside its card, and inspect `[role="dialog"]`. Verify title, media order, image load (`complete` and `naturalWidth`), Swiper pagination, and `scrollWidth <= clientWidth` at desktop and 390px.
3. Close the modal and confirm the background remains at the prior scroll position.

## Gotchas

- Project cards also have external links; click `Details` to avoid leaving the site.
- Media order and URL mapping live in `src/lib/projects.ts`; carousel layout lives in `src/features/projects/components/project-media-carousel/`.
- The project list is server-rendered from published documents, so drafts in the Payload admin are intentionally absent.
