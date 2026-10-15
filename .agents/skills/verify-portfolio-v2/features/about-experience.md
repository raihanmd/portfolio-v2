# About and experience

## Sub-features

- Personal summary, skills, events, and experience entries on `/about-me`.

## How to get to it (user POV)

Use the About link in the site navigation. Scroll to Experience; its entries are read from Payload.

## Driving it with Chromium Playwright

1. Navigate to `/about-me` at 1440px and wait for the lanyard to settle. Confirm its glossy front card hangs on the left, and that `/images/lanyard-front.jpg`, `/images/lanyard-back.jpg`, and `/images/band-rope.png` load successfully.
2. Click the card and confirm its QR-code back appears. Drag it from the left across the reading column and far down the full About page: it should move behind the text, remain visible in the full-height canvas, and snap back when released. At 1280px the card remains visible; at 1279px and 390px it is absent and the page has no horizontal overflow.
3. Capture the page title and section headings. Scroll to Experience and record a visible company and role. Compare that entry with a published `/api/experiences` response.

## Gotchas

- Experience data is stored in the `experiences` collection and rendered by an async server component. This collection has no draft mode; a saved edit is public on the next request.
- The React Bits lanyard may sway briefly; verify content and layout after it settles rather than asserting one animation frame. Its card images were extracted from the original `/3d/card.glb` texture atlas.
