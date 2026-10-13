# About and experience

## Sub-features

- Personal summary, skills, events, and experience entries on `/about-me`.

## How to get to it (user POV)

Use the About link in the site navigation. Scroll to Experience; its entries are read from Payload.

## Driving it with Chromium Playwright

1. Navigate to `/about-me` and capture the page title and section headings. Scroll to Experience and record a visible company and role.
2. Compare that entry with a published `/api/experiences` response. At 390px, confirm the text remains readable without horizontal page overflow.

## Gotchas

- Experience data is stored in the `experiences` collection and rendered by an async server component. This collection has no draft mode; a saved edit is public on the next request.
- The 3D/event badge area may use animation; verify content and layout after it settles rather than asserting one animation frame.
