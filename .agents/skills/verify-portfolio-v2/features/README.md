# Public feature map

## Baseline preconditions

- Use the origin and Git commit recorded for this run. A local server must be started with `PAYLOAD_MIGRATING=true` when its `.env` may use the production database.
- TIL and project documents use drafts: the public site reads their published versions, while autosaved drafts stay in the admin/version history. Experience entries have no draft mode.
- Browser checks of feed modals and project cards are read-only. Direct TIL pages trigger a view count after 1.5 seconds in a browser session.

## Driving conventions

Use Chromium Playwright tools and inspect the accessibility snapshot before clicking. Prefer the selectors and routes in each feature file. Do not rely on one fixed TIL or project existing forever; choose a currently published record with the needed media from the public API, then record its slug/title in the proof.

## Proof and skip reporting

For each feature, record the action and visible result, origin, viewport, console errors, and screenshot or snapshot path. If required published content or authorization is unavailable, report the exact prerequisite and route attempted. Never change production content to manufacture a test case.

## Features

- [TIL feed and modal](til-feed-modal.md)
- [TIL direct detail](til-detail.md)
- [Projects gallery](projects-gallery.md)
- [About and experience](about-experience.md)
