# PROJECT KNOWLEDGE BASE

**Generated:** 2026-08-10
**Commit:** f00cab2
**Branch:** main

## OVERVIEW
Static 3-page portfolio for Raihanmd (Software Engineer & Web3 Developer). Next.js 14.2 App Router, React 18, TypeScript strict, Tailwind 3.4 + shadcn/ui (new-york), Bun. Scaffolded from create-t3-app 7.37.0. Heavy 3D hero (three.js + react-three-fiber/rapier). No backend — all content is static constants.

## STRUCTURE
```
portfolio-v2/
├── src/
│   ├── app/              # App Router: layout, page (home), projects/, about-me/, sitemap, robots
│   ├── _components/      # Shared UI kit (shadcn ui/ + custom animation helpers) → see src/_components/AGENTS.md
│   ├── features/         # Feature-sliced page sections → see src/features/AGENTS.md
│   ├── constant/         # (singular) all site data: project, skill, service, timeline, navbar, seo
│   ├── atom/             # Jotai atom: game-development.ts (3D scene state)
│   ├── lib/              # cn.ts (clsx+tailwind-merge), seo-schema.ts (JSON-LD generators)
│   ├── providers/        # root-provider.tsx (next-themes), theme-provider.tsx
│   ├── styles/           # globals.css (hoisted out of app/)
│   ├── types/            # index.ts (IProject, TProjectCategory, ...)
│   └── env.js            # T3 env validation (zod), loaded by next.config.js
├── public/               # 3d/card.glb, images/, favicon.ico, site.webmanifest, robots.txt (dead)
└── global.d.ts           # ambient decls for *.glb/*.png/meshline JSX intrinsics (root-level)
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Page routes | `src/app/**/page.tsx` | Thin wrappers composing feature components |
| Page sections | `src/features/<route>/components/` | Folder-per-component, `index.tsx` default export |
| Shared UI / animations | `src/_components/` | `ui/` = shadcn + project extensions; AnimateItem/AnimateFade/Each |
| Site content/data | `src/constant/` | `project.ts` = 10KB project DB; edit copy here |
| SEO metadata + JSON-LD | `src/constant/seo.ts`, `src/lib/seo-schema.ts`, `src/app/{layout,sitemap,robots}.ts`, `src/_components/seo/json-ld.tsx` | Schema objects → JsonLd component |
| Env vars | `src/env.js`, `.env.example` | `NEXT_PUBLIC_SITE_URL` + 2 SEO verification keys |
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

## CONVENTIONS
- **Alias `~/*` → `src/*`** (T3 default). Never `@/`.
- **Imports**: inline `import { type Foo }` (consistent-type-imports, inline fixStyle). Unused vars: `warn` with `argsIgnorePattern: "^_"`.
- **ESM everywhere**: `"type": "module"`; `next.config.js`/`prettier.config.js` are ESM (top-level `await import("./src/env.js")`).
- **ESLint**: legacy `.eslintrc.cjs` (ESLint 8, `next lint`). Do NOT migrate to flat config. `ban-ts-comment` is off; `require-await` off; `no-misused-promises` on (event handlers exempt).
- **Prettier**: defaults only (double quotes, semicolons, 80 width) + `prettier-plugin-tailwindcss` (auto-sorts classes).
- **Tailwind**: `darkMode: ["class"]`, content glob ONLY `./src/**/*.tsx`. Dynamic classnames must go in the `safelist`. Uses internal `flattenColorPalette` (behind `@ts-ignore`) + `mini-svg-data-uri` for aurora/grid utilities — fragile against Tailwind upgrades.
- **shadcn**: new-york style, aliases `components: ~/_components`, `utils: ~/lib/cn`. Add components via `bunx shadcn add`.
- **Design rules**: shadcn semantic classes only (`bg-muted`, `text-muted-foreground`) — no inline `style={{var(...)}}` or raw hex in components; 8-state interactive components; focus-visible distinct from hover.
- **No server code**: zero API routes, no middleware, no server actions, no `"use server"`. All pages are static RSC exporting `metadata`.

## ANTI-PATTERNS (THIS PROJECT)
- **Do NOT add `@/` imports** — alias is `~/*`.
- **Do NOT hand-edit shadcn files in `src/_components/ui/`** casually — regenerate via `bunx shadcn add`.
- **Do NOT add UI primitives to `src/features/`** — use `~/_components`.
- **Do NOT add `route.ts` / API routes** — this is a deliberate static site (tRPC deps are vestigial, unused).
- **Do NOT "fix" copy in `src/constant/`** — content is authored (known quirks: "Theese are what can i do for you" typo is intentional to preserve).
- **Do NOT touch `/* eslint-disable */` + `//@ts-nocheck` in `src/features/about-me/components/event-badge/`** — intentional suppression on the 3D physics component.
- **Do NOT `@ts-ignore` new code** — only tailwind.config.ts has one (flattenColorPalette); `.eslintrc.cjs` currently permits it, but keep it out of src/.

## UNIQUE STYLES
- 3D hero: three 0.168 + `@react-three/fiber` v8 + drei + rapier + meshline + leva; `global.d.ts` declares `*.glb`/`*.png` and `meshLineGeometry`/`meshLineMaterial` JSX intrinsics.
- Motion: `motion` (framer-motion successor) via `AnimateItem`/`AnimateFade` wrappers — never raw `motion.div` in features.
- State: Jotai atoms in `src/atom/` (only game-development.ts) + local `useState` in features; `usehooks-ts` for window-size/boolean helpers.
- Dark/light via next-themes (`class` strategy); Geist fonts.

## COMMANDS
```bash
bun install                  # install (Bun is the package manager; bun.lock committed)
bun run dev                  # dev server (Turbopack: next dev --turbo)
bun run build                # production build (webpack; fails on missing env unless SKIP_ENV_VALIDATION=true)
SKIP_ENV_VALIDATION=true bun run build   # build without .env
bun run start                # serve production build
bun run lint                 # next lint (ESLint 8 legacy config)
npx tsc --noEmit             # typecheck (NO script exists — ad-hoc only)
```
No test runner, no test files, no CI/CD. Deploy target is Vercel (inferred: README + `.vercel/` in .gitignore) as a stock Next.js app; no vercel.json.

## NOTES
- **README is stale**: claims Prisma + Dockerfile in the stack — neither exists. Trust package.json.
- **Vestigial deps**: `@trpc/*`, `@tanstack/react-query`, `superjson`, `react-typed` are installed but unreferenced in src/. `@t3-oss/env-nextjs` IS used.
- **Dangling alias**: components.json declares `hooks: ~/hooks` but no `src/hooks/` dir exists.
- **Dead file**: `public/robots.txt` is shadowed by `app/robots.ts` metadata route (route wins).
- **Env required**: `NEXT_PUBLIC_SITE_URL` (used by sitemap/robots/seo-schema). Optional: Google/Yandex verification keys.
- **Outstanding TODO**: `src/features/home/components/experience/index.tsx` — hardcoded `EXPERENCES` array slated to become an API call.
- **LSP**: project's default language server (Deno) cannot handle this TSX project — use tsc/ESLint for validation.
