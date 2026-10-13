# TIL feed and modal

## Sub-features

- Paginated feed of published TIL notes, with a masked preview and an overlay link.
- Intercepting-route modal with the full rich text, uploaded images, close/back behavior, and a share control.

## How to get to it (user POV)

Open `/til`, wait until `Loading TILs…` disappears, then click a note. The card link is `a[href="/til/<slug>"]`; the accessible label starts with `Read TIL from`. A soft navigation opens `[role="dialog"]` over the feed.

## Driving it with Chromium Playwright

1. Capture the feed links with `document.querySelectorAll('a[href^="/til/"]')` and a before snapshot. For an image check, choose a published TIL whose public `/api/tils?depth=1` data includes a Lexical `upload` node. Scroll to the feed sentinel if pagination has not loaded the chosen card.
2. Click the card link. Check `location.pathname` equals its slug and `[role="dialog"]` exists. Inside the dialog, verify the upload `img` has a public `src`, `complete === true`, and `naturalWidth > 0`; check the dialog's `scrollWidth <= clientWidth` at desktop and 390px mobile.
3. Check the dialog has an accessible title and description (`aria-labelledby` and `aria-describedby`). Close with Escape or the Close control and confirm the feed returns without a background scroll jump.

## Gotchas

- `src/lib/fetch-til.ts` must request `depth: 1`; `depth: 0` leaves upload values as numeric IDs and Payload's JSX converter omits the image. The direct detail page uses a separate Postgres query in `src/lib/query-til.ts`.
- Modal opens do not increment TIL views. A feed card's media preview can work even when the modal's media lookup is broken.
- A published version can lose an upload while an older version still contains it. Check live content and latest published version before blaming cache.
