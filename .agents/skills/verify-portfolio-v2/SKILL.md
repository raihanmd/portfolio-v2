---
name: verify-portfolio-v2
description: Verify portfolio-v2 public web flows with a browser and scoped checks, especially TIL media, projects, and published CMS content.
---

# Verify portfolio-v2

Read [the feature map](features/README.md), then drive the relevant entries. The public Next.js site is the primary surface. Payload admin is the authoring surface; use it only with an isolated database and authorized credentials. The `.env` in this checkout can point at the production database.

## Launch

- Reuse a dev server only after checking its port and ownership. For a new local run, verify the database tunnel and `.env` exist, choose an unused port, then start `PAYLOAD_MIGRATING=true bun run dev --port 3001` in a tracked terminal session. `PAYLOAD_MIGRATING=true` prevents Payload's development schema push against the shared database. Do not run migrations, seeds, or a build as part of this browser check.
- Ready means Next prints `Ready` and `GET http://127.0.0.1:3001/til` returns 200. Keep the terminal session ID. Stop only that session after the last drive.
- If the database tunnel is unavailable, use `https://www.raihanmd.xyz` for read-only checks of deployed behavior and label that evidence as production, not proof of local edits.

## Doctor

Run `ss -ltnp` to identify the listener, then run `curl -fsS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3001/til` and the same command for `/projects`. Confirm both return 200 and inspect the server terminal for errors. If a shared instance behaves unexpectedly, check its owner and logs before driving it again. Never start a second instance on a port already in use.

## Drive

Use the Chromium Playwright browser tools (`mcp__playwright_chromium__browser_navigate`, `browser_snapshot`, `browser_click`, `browser_evaluate`, `browser_resize`, `browser_take_screenshot`) when available. The feature files give stable route paths and selectors. Start with a feed/card view, perform the user action, and inspect the resulting dialog or page. A direct browser visit to `/til/[slug]` runs the view counter after 1.5 seconds; use an HTTP GET for read-only detail checks when testing against the production database.

## Evidence

- Capture the state before and after the action: a browser snapshot or screenshot, the route/selector used, and an assertion on the visible result. For media, require `img.complete && img.naturalWidth > 0`, a nonempty `src`, and `dialog.scrollWidth <= dialog.clientWidth`. A rendered `<img>` alone does not prove the file loaded.
- Save screenshots under `.playwright-mcp/verify-portfolio-v2-<date>-<feature>.png`. This folder is ignored by Git and survives server teardown. Record the checked origin and Git commit alongside the evidence. For a changed data path, compare published API content with the rendered page; note whether an admin edit is still a draft.
- Run `bunx tsc --noEmit`, `bun run lint`, targeted Prettier, and `git diff --check` for changed code. Report skipped checks and why. Do not claim a local fix is deployed until the production origin is checked after deployment.

## Cleanup

Close the browser tab/session used for the run. Stop only the dev server terminal session started by this run; leave a user's existing server and SSH tunnel running. Keep `.playwright-mcp/` evidence. Confirm the listener you started is gone and `git status --short` contains only intended source changes.
