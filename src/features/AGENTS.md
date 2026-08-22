# src/features — Page Sections

## OVERVIEW

Feature-sliced per-page section code. `home/`, `projects/`, `about-me/` each own their components; app routes (`src/app/**/page.tsx`) are thin wrappers that compose them.

## STRUCTURE

- `home/components/` — Headline, Experience (+ experience-card), Service
- `projects/` — index.tsx + `components/` (ProjectsGrid, ProjectFilter, ProjectDetailModal, ProjectCard)
- `about-me/components/` — Summary, Skill, GithubCalendar, EventBadgeContainer (+ event-badge), CTA
- `til/` — index.tsx + `components/` (TilFeed, TilRow, TilInfiniteScroll, TilSkeleton, TilEmpty, TilError, TilRichText (til-content), CodeBlock, TilDetail, TilDetailModal, TilShareButton)

## WHERE TO LOOK

| Task | Location | Notes |
|---|---|---|
| Hero / landing intro | `home/components/headline` | — |
| Work history | `home/components/experience` | Fetched from Payload CMS `experiences` collection (server-side RSC via `getPayload`) |
| Services offered | `home/components/service` | Copy typo intentional; don't fix |
| Project listing + filtering | `projects/components/projects-grid` | Owns category filter state, calls `onFilterChange` |
| Filter chips | `projects/components/project-filter` | Controlled by parent grid |
| Project detail overlay | `projects/components/project-detail-modal` | shadcn Dialog |
| Single project entry | `projects/components/project-card` | — |
| Intro / bio | `about-me/components/summary` | — |
| Skill rows | `about-me/components/skill` (+ skill-card) | Data from `~constant/skill` |
| Contribution graph | `about-me/components/github-calendar` | — |
| Contact callout | `about-me/components/cta` | — |
| 3D physics badge | `about-me/components/event-badge` | Suppressed lint/ts; don't touch |
| TIL feed list | `til/components/til-feed` + `til-row` | IO infinite scroll; masked 280px preview cards link to `/til/[id]` via an overlay Link (copy button lifted above with `z-20`) |
| TIL code blocks | `til/components/code-block` | prism-react-renderer highlight (oneDark/oneLight), language label, copy button |
| TIL full content / modal / share | `til/components/til-detail`, `til-detail-modal`, `til-share-button` | Standalone page body, intercepting-route modal, Web Share/copy link |

## CONVENTIONS

- One folder per component, default export in `index.tsx` (e.g. `projects/components/projects-grid/index.tsx`).
- Compose UI primitives from `~/_components` (Section, SectionHeader, SectionContent, AnimateItem, AnimateFade, Each, Card, Badge, Button, Separator, Marquee). Features never define their own primitives.
- Import data from `~constant` (singular): `project.ts` (PROJECTS, PROJECT_CATEGORIES, CATEGORY_OPTIONS), `skill.ts`, `service.ts`, `navbar.ts` (NAV_LINKS). Experience data comes from Payload CMS (see `experience/index.tsx`).
- Types from `~types` (IProject, TProjectCategory) plus inline component props.
- Client interactivity via `useState`; shared filter state lifted through `onFilterChange` callbacks.
- Conditional classes via `cn()` from `~/lib/cn`. Tailwind utilities + shadcn semantic classes (`text-muted-foreground`, `bg-muted`, `border-border`).

## ANTI-PATTERNS

- Do NOT add new UI primitives here — put them in `~/_components`.
- Do NOT touch `event-badge`'s `/* eslint-disable */` / `//@ts-nocheck` — 3D physics intentionally suppressed.
- Do NOT edit copy inside constants (service typo "Theese are what can i do for you" is intentional).
- Do NOT remove the "No projects found in the selected categories" empty state in projects-grid.
- Do NOT change the Experience component's data source — it fetches from Payload CMS `experiences` collection.
- Do NOT add `@/` imports — the alias is `~/`.
- No inline styles for colors/spacing; components must cover all interactive states (hover, focus-visible, active, disabled, loading, empty, error).
