# AGENTS.md — src/_components

Shared UI kit for the portfolio. Leading underscore is intentional: `components.json` aliases `components: ~/_components`, `ui: ~/_components/ui`, `utils: ~/lib/cn`. Never rename the folder.

## Structure

```
src/_components/
  ui/                  shadcn/ui new-york components + project extensions
    button card dialog tooltip separator scroll-area badge skeleton kbd   # shadcn-generated
    section.tsx        Section / SectionHeader / SectionContent
    marquee.tsx        infinite scroll rows (--duration var, reverse/pauseOnHover)
    aurora-background.tsx
    spinner.tsx theme-toggler.tsx   # project extensions
  seo/
    json-ld.tsx        JsonLd({ scripts }) -> <script type="application/ld+json">
  navbar.tsx           site nav
  animate-fade.tsx     AnimateFade — motion entrance wrapper (framer-motion motion.div)
  animate-item.tsx     AnimateItem — motion entrance wrapper (delayChildren/staggerChildren)
  each.tsx             Each — generic <Each of={items} render={fn}> map helper
  typing-animation.tsx
```

## Where to look

| Task | File | Notes |
|------|------|-------|
| Add/edit a primitive (button, card, dialog…) | `ui/` shadcn file | `bunx shadcn add/update`; hand-edit only for project tweaks |
| Section heading + content layout | `ui/section.tsx` | Section > SectionHeader(title, description, Icon) > SectionContent |
| Entrance animation | `animate-item.tsx` / `animate-fade.tsx` | Never raw motion.div in features. `AnimateFade` supports `fadeContainer={false}` (stagger children without container fade — used by the TIL feed) |
| Map an array to JSX | `each.tsx` | `<Each of={items} render={(item) => …} />` |
| JSON-LD structured data | `seo/json-ld.tsx` | Pass schema objects; renders ld+json script tags |
| Infinite scroll row | `ui/marquee.tsx` | `--duration` CSS var controls speed; reverse / pauseOnHover props |
| Theme toggle | `ui/theme-toggler.tsx` | `next-themes` + Radix Tooltip wrapper |

## Conventions

- **Animation & iteration**: features must use the wrappers (AnimateItem, AnimateFade, Each), not raw `motion.div` or `.map()` scattered inline.
- **Section composition**: features compose `Section` → `SectionHeader` → `SectionContent` from `ui/section.tsx`; do not re-roll section layouts per feature.
- **`ui/` is generated code**: shadcn anatomy, standard variants/sizes. Tweak via the shadcn CLI; reserve hand-edits for deliberate project-specific deviations.
- **`seo/` for structured data**: all `application/ld+json` output flows through `JsonLd`.
- **Design rules**: interactive components carry the 8-state matrix (default/hover/focus-visible/active/disabled/loading/empty/error); focus-visible ring must be distinct from hover; tokens come from the design system, never raw hex.

## Anti-patterns

- **No new root files for single-feature components.** A component belongs in `_components/` only if 2+ features share it; otherwise co-locate it in the feature's own `components/` dir.
- **No casual hand-edits to `ui/` shadcn files** — regenerate through the CLI, keep diffs auditable.
- **No raw `motion.div` in features** — wrap via AnimateItem / AnimateFade so motion stays centralized here.
- **No inline `style={{}}` with design tokens** in this kit — use shadcn semantic classes (`bg-card`, `text-muted-foreground`, `border-border`, …).
