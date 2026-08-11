# PROJECT KNOWLEDGE BASE

**Generated:** 2026-08-10
**Commit:** f00cab2
**Branch:** main

## OVERVIEW
Portfolio for Raihanmd (Software Engineer & Web3 Developer) + Payload CMS 3 blog/feed backend. Next.js **15.4.x** (PINNED — see Conventions), React **19.2**, TypeScript strict, Tailwind 3.4 + shadcn/ui (new-york), Bun. Scaffolded from create-t3-app 7.37.0. Heavy 3D hero (three.js + react-three-fiber v9/rapier v2). Hybrid: most pages are static RSC; `/til` feed + Payload admin/API are server-rendered by Next on demand. Site content is static constants; TIL content lives in Postgres via Payload.

## STRUCTURE
```
portfolio-v2/
├── payload.config.ts      # Payload 3 config (collections, lexical editor, postgres adapter, importMap)
├── payload-types.ts       # GENERATED (npx payload generate:types) — Til/User types
├── src/
│   ├── app/               # App Router: multiple root layouts — (site)/ (portfolio html), (payload)/ (Payload html)
│   │   ├── (site)/        # Portfolio route group: layout (html), page (home), projects/, about-me/, til/, sitemap, robots
│   │   └── (payload)/     # Payload CMS route group: /admin, /api, /graphql (+ custom.scss, importMap)
│   ├── _components/       # Shared UI kit (shadcn ui/ + custom animation helpers) → see src/_components/AGENTS.md
│   ├── features/          # Feature-sliced page sections → see src/features/AGENTS.md
│   ├── collections/       # Payload collection configs: tils.ts, users.ts
│   ├── constant/          # (singular) all site data: project, skill, service, timeline, navbar, seo
│   ├── atom/              # Jotai atom: game-development.ts (3D scene state)
│   ├── lib/               # cn.ts (clsx+tailwind-merge), seo-schema.ts (JSON-LD generators)
│   ├── providers/         # root-provider.tsx (next-themes), theme-provider.tsx
│   ├── styles/            # globals.css (hoisted out of app/)
│   ├── types/             # index.ts (IProject, TProjectCategory, ...)
│   └── env.js             # T3 env validation (zod), loaded by next.config.js
├── public/                # 3d/card.glb, images/, favicon.ico, site.webmanifest, robots.txt (dead)
└── global.d.ts            # ambient decls for *.glb/*.png + R3F v9 ThreeElements augmentation (root-level)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Page routes | `src/app/(site)/**/page.tsx` | Thin wrappers composing feature components |
| Page sections | `src/features/<route>/components/` | Folder-per-component, `index.tsx` default export |
| Shared UI / animations | `src/_components/` | `ui/` = shadcn + project extensions; AnimateItem/AnimateFade/Each |
| Site content/data | `src/constant/` | `project.ts` = 10KB project DB; edit copy here |
| SEO metadata + JSON-LD | `src/constant/seo.ts`, `src/lib/seo-schema.ts`, `src/app/(site)/{layout,sitemap,robots}.ts`, `src/_components/seo/json-ld.tsx` | Schema objects → JsonLd component |
| TIL feed UI | `src/features/til/` + `src/app/(site)/til/page.tsx` | Client-side infinite-scroll feed; fetches `/api/tils?limit=10&page=N&sort=-date` |
| Payload CMS config | `payload.config.ts`, `src/collections/` | Collections `tils` (date + lexical content, drafts/autosave) & `users` (auth) |
| Payload routes | `src/app/(payload)/` | admin UI, REST `/api`, GraphQL (/graphql + /graphql-playground) |
| Env vars | `src/env.js`, `.env.example` | `NEXT_PUBLIC_SITE_URL` + 2 SEO verification keys + Payload `DATABASE_URL`/`PAYLOAD_SECRET` |
| Types | `src/types/index.ts` | `IProject`, `TProjectCategory` |
| 3D hero state | `src/atom/game-development.ts` | Jotai atom |

## CODE MAP
| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `SITE_CONFIG`, `PAGE_SEO`, `ROBOTS_RULES`, `SITE_PAGES` | const | `src/constant/seo.ts` | All SEO/meta content |
| `PROJECTS`, `PROJECT_CATEGORIES`, `CATEGORY_OPTIONS` | const | `src/constant/project.ts` | Project data + filter options |
| `TIMELINE` | const | `src/constant/timeline.ts` | Experience data (imported as `EXPERENCES` in feature) |
| `JsonLd` | component | `src/_components/seo/json-ld.tsx` | Renders `<script type="application/ld+json">` |
| `Section`/`SectionHeader`/`SectionContent` | component | `src/_components/ui/section.tsx` | Standard page-section skeleton used by features |
| `AnimateItem`, `AnimateFade`, `Each`, `TypingAnimation`, `Navbar` | component | `src/_components/*` | Motion wrappers, iteration helper, nav |
| `ProjectsFeature`, `ProjectsGrid`, `ProjectFilter`, `ProjectDetailModal`, `ProjectCard` | component | `src/features/projects/` | Category filter + grid + modal detail |
| `Headline`, `Experience`, `Service` | component | `src/features/home/` | Home page sections |
| `Summary`, `Skill`, `GithubCalendar`, `CTA`, `EventBadge*` | component | `src/features/about-me/` | About page sections |
| `Tils`, `Users` | collection | `src/collections/tils.ts`, `src/collections/users.ts` | Payload collections (Til/User types in root `payload-types.ts`) |
| `TilFeature`, `TilFeed`, `TilRow`, `TilInfiniteScroll`, `TilSkeleton`, `TilEmpty`, `TilError` | component | `src/features/til/` | TIL feed: date-left/content-right, IO infinite scroll, RichText via `@payloadcms/richtext-lexical/react` |

## CONVENTIONS
- **Alias `~/*` → `src/*`** (T3 default). Never `@/`.
- **Imports**: inline `import { type Foo }` (consistent-type-imports, inline fixStyle). Unused vars: `warn` with `argsIgnorePattern: "^_"`.
- **ESM everywhere**: `"type": "module"`; `next.config.js`/`prettier.config.js` are ESM (top-level `await import("./src/env.js")`).
- **ESLint**: legacy `.eslintrc.cjs` (ESLint 8, `next lint`). Do NOT migrate to flat config. `ban-ts-comment` is off; `require-await` off; `no-misused-promises` on (event handlers exempt).
- **Prettier**: defaults only (double quotes, semicolons, 80 width) + `prettier-plugin-tailwindcss` (auto-sorts classes).
- **Tailwind**: `darkMode: ["class"]`, content glob ONLY `./src/**/*.tsx`. Dynamic classnames must go in the `safelist`. Uses internal `flattenColorPalette` (behind `@ts-ignore`) + `mini-svg-data-uri` for aurora/grid utilities — fragile against Tailwind upgrades.
- **shadcn**: new-york style, aliases `components: ~/_components`, `utils: ~/lib/cn`. Add components via `bunx shadcn add`.
- **Next is PINNED to 15.4.x**: Payload 3 peer range is `15.4.11 ≤ next < 15.5.0 || 16.2.6+` — 15.5.x is NOT supported. Do NOT bump `next`/`eslint-config-next` outside the 15.4 line (upgrading means jumping to 16.2.6+ in one deliberate move).
- **Design rules**: shadcn semantic classes only (`bg-muted`, `text-muted-foreground`) — no inline `style={{var(...)}}` or raw hex in components; 8-state interactive components; focus-visible distinct from hover.
- **Server code is Payload-only**: the ONLY API routes / server rendering come from the `src/app/(payload)/` route group (Payload admin + REST `/api` + GraphQL) plus the client-fetched `/til` page (static RSC shell, client-side fetch). Everything else stays static RSC exporting `metadata`. No middleware, no server actions, no `"use server"` outside Payload's own internals.
- **Multiple root layouts** (Next.js pattern): NO root `src/app/layout.tsx`. `(site)/layout.tsx` renders the portfolio `<html>` (globals.css, Navbar, next-themes, SEO metadata) and `(payload)/layout.tsx` renders Payload's own `<html>` (`@payloadcms/next/css` + `custom.scss`). Payload's `RootLayout` emits its own `<html>`, so it MUST NOT be nested under a global root layout — that causes `validateDOMNesting`/hydration errors and leaks site CSS+Navbar into `/admin`. New top-level routes must go inside `(site)/` (or `(payload)/` for Payload). `suppressHydrationWarning` on `<html>` is intentional (next-themes).

## ANTI-PATTERNS (THIS PROJECT)
- **Do NOT add `@/` imports** — alias is `~/*`.
- **Do NOT hand-edit shadcn files in `src/_components/ui/`** casually — regenerate via `bunx shadcn add`.
- **Do NOT add UI primitives to `src/features/`** — use `~/_components`.
- **Do NOT rewire or hand-edit `src/app/(payload)/`** — it's generated/wired by Payload 3 (`payload generate:importmap` regenerates `admin/importMap.js`). Route files follow Payload's official template.
- **Do NOT add NEW `route.ts` / API routes outside `(payload)/`** — static site by design; the only exceptions are Payload's own routes. (tRPC deps are vestigial, unused.)
- **Do NOT edit `payload-types.ts`** — generated by `npx payload generate:types` after collection changes.
- **Do NOT edit `src/collections/` without regenerating types** — after changing a collection, run `npx payload generate:types`.
- **Do NOT "fix" copy in `src/constant/`** — content is authored (known quirks: "Theese are what can i do for you" typo is intentional to preserve).
- **Do NOT touch `/* eslint-disable */` + `//@ts-nocheck` in `src/features/about-me/components/event-badge/`** — intentional suppression on the 3D physics component.
- **Do NOT `@ts-ignore` new code** — only tailwind.config.ts has one (flattenColorPalette); `.eslintrc.cjs` currently permits it, but keep it out of src/.

## UNIQUE STYLES
- 3D hero: three 0.168 + `@react-three/fiber` v9 + drei v10 + rapier v2 + meshline + leva; `global.d.ts` declares `*.glb`/`*.png` and augments R3F's `ThreeElements` with `meshLineGeometry`/`meshLineMaterial` (v9 removed the global JSX namespace).
- Motion: `motion` (framer-motion successor) via `AnimateItem`/`AnimateFade` wrappers — never raw `motion.div` in features.
- State: Jotai atoms in `src/atom/` (only game-development.ts) + local `useState` in features; `usehooks-ts` for window-size/boolean helpers.
- Dark/light via next-themes (`class` strategy); Geist fonts.

## COMMANDS
```bash
bun install                  # install (Bun is the package manager; bun.lock committed)
bun run dev                  # dev server (Turbopack: next dev --turbopack)
bun run build                # production build (webpack; fails on missing env unless SKIP_ENV_VALIDATION=true)
SKIP_ENV_VALIDATION=true bun run build   # build without .env
bun run start                # serve production build
bun run lint                 # next lint (ESLint 8 legacy config)
npx tsc --noEmit             # typecheck (NO script exists — ad-hoc only)
npx payload generate:types   # regenerate payload-types.ts after collection edits
npx payload generate:importmap  # regenerate src/app/(payload)/admin/importMap.js after admin UI changes
```
No test runner, no test files, no CI/CD. Deploy target is Vercel (inferred: README + `.vercel/` in .gitignore) as a stock Next.js app; no vercel.json. NOTE: Payload needs a real Postgres (`DATABASE_URL`) + `PAYLOAD_SECRET` at runtime — dev server will not boot Payload admin without them; build passes with SKIP_ENV_VALIDATION.

## NOTES
- **README is stale**: claims Prisma + Dockerfile in the stack — neither exists. Trust package.json.
- **Vestigial deps**: `@trpc/*`, `@tanstack/react-query`, `superjson`, `react-typed` are installed but unreferenced in src/. `@t3-oss/env-nextjs` IS used.
- **Dangling alias**: components.json declares `hooks: ~/hooks` but no `src/hooks/` dir exists.
- **Removed**: `public/robots.txt` was deleted (Next 15 dev errors on conflicting public file vs `app/robots.ts`; the metadata route is authoritative).
- **Env required**: `NEXT_PUBLIC_SITE_URL` (used by sitemap/robots/seo-schema). Optional: Google/Yandex verification keys. Payload: `DATABASE_URL` + `PAYLOAD_SECRET` (only needed at runtime, not build).
- **Vestigial deps**: `@trpc/*`, `@tanstack/react-query`, `superjson`, `react-typed` are installed but unreferenced in src/. `@t3-oss/env-nextjs` IS used.
- **Outstanding TODO**: `src/features/home/components/experience/index.tsx` — hardcoded `EXPERENCES` array slated to become an API call.
- **LSP**: project's default language server (Deno) cannot handle this TSX project — use tsc/ESLint for validation.
