# Playground and reusable content tools

**Status:** Approved on 2026-10-20
**Scope:** Payload authoring, Blog/TIL/Playground rich content, and wide interactive blocks

## Goal

Add a Payload-managed `/playground` catalog whose detail pages can combine normal
Lexical content with interactive tools. A tool is implemented once and then becomes
available to Blog, TIL, and Playground without editing each collection or renderer.

One Payload Playground document represents one public tool page. The author controls
the prose and placement of any tool instances in its rich content. The public list
shows only the tool name and description; `/playground/[slug]` renders the full
document.

## Boundaries

A genuinely new interactive tool still needs code for its Payload block schema and
its React renderer. “No consumer changes” means that adding the tool does not require
manual edits in the Blog collection, TIL collection, Playground collection, or the
shared rich-text converter.

The implementation must preserve existing serialized Lexical block slugs. In
particular, Vector 2D Playground remains `vector2dPlayground` in stored content even
if its files move into the new tool structure.

## Tool package contract

Each tool lives in one self-contained folder:

```text
src/content-tools/<tool-name>/
├── manifest.ts
├── block.server.ts
├── renderer.client.tsx
└── ...tool-specific modules
```

`manifest.ts` contains data that is safe in both server and client graphs:

```ts
export const manifest = {
  slug: "vector2dPlayground",
  kind: "tool",
  surfaces: ["blog", "til", "playground"],
  width: "wide",
} as const;
```

The conventions are:

- `slug` is a permanent storage/API identifier and must not be renamed after use.
- `kind: "tool"` distinguishes interactive tools from ordinary editorial blocks.
- `surfaces` defaults to Blog, TIL, and Playground for a tool. A tool may explicitly
  restrict authoring when a future use case requires it.
- `width` is `"prose" | "wide"` and defaults to `"wide"` for tools. A prose-width
  tool opts in explicitly.
- `block.server.ts` exports only the Payload `Block` schema and server-safe helpers.
- `renderer.client.tsx` exports the public React renderer. It must not import Payload
  collection configuration or other server-only modules.

Vector 2D Playground becomes the first package following this contract.

## Generated registries

A repository script scans `src/content-tools/*` and writes two static projections:

1. A server registry with block schemas and authoring metadata.
2. A client registry with block slug, renderer, and width metadata.

Static generated imports preserve Next.js bundle analysis and avoid pulling every
client renderer into Payload configuration. The generated files are committed so CI
and production builds are deterministic. The generator runs before type generation
and is included in the normal development/build preparation path. A check mode fails
when a tool package exists but generated output is stale.

Collections use one shared `createContentEditor` helper:

```ts
createContentEditor({
  surface: "blog",
  uploadCollection: "blog-media",
})
```

The helper adds the default Lexical features, the surface-specific upload feature,
stable editorial blocks such as Code, and every generated tool whose manifest allows
that surface. Blog, TIL, and Playground therefore do not maintain independent tool
arrays.

The shared `RichContent` converter consumes the client registry once. Unknown block
slugs fail softly in public rendering and produce a development diagnostic rather
than crashing the whole article. Editor availability and public rendering remain
separate: removing a surface from a manifest prevents new authoring there, while an
already-published node with that slug can still render.

## Playground content model

Add a Payload `playgrounds` collection with:

- `name`: required, used as the admin title and public heading.
- `slug`: required, unique, generated from the name, and locked after first publish.
- `description`: required short text used by the catalog and metadata.
- `content`: required Lexical rich text from `createContentEditor({ surface:
  "playground" })`.
- `publishedAt`: set once, on the first transition to published.
- Payload drafts and autosave through the standard `_status` workflow.

Only published documents appear publicly. The initial catalog sorts by immutable
`publishedAt` descending with the document id as a stable tie-breaker. This avoids a
manual-order relation until the catalog proves it needs curation.

Routes stay inside the site route group:

```text
src/app/(site)/playground/page.tsx
src/app/(site)/playground/[slug]/page.tsx
```

The list uses the existing page frame and motion primitives. Each row contains the
name and description only. The detail page reuses the content detail shell and rich
renderer, but identifies itself as Playground through its eyebrow, back label, and
metadata instead of copying Blog’s article metadata.

## Narrow prose and wide tools

Normal prose must retain the established 672px reading measure. Widening the entire
article would weaken readability, while keeping every tool inside that measure makes
graph and canvas tools cramped.

The detail content area aligns to the site’s `max-w-6xl` frame and uses three grid
tracks:

```css
grid-template-columns:
  minmax(0, 1fr)
  minmax(0, min(100%, 42rem))
  minmax(0, 1fr);
```

Ordinary Lexical nodes occupy the center track. A generated converter wraps each tool
with `data-content-width`. A `wide` tool spans the full grid and is capped at
`max-w-5xl`; a `prose` tool stays in the center track. At small widths the side tracks
collapse naturally, so neither negative margins nor viewport-width calculations are
needed.

Blog, TIL, and Playground use this same layout contract. Navigation and metadata stay
in the narrow track. Existing detail cards must be restructured so `overflow-hidden`
does not clip a wide child. Inside an intercepting modal, “wide” means the available
dialog body width rather than the browser viewport.

## Data flow

1. An admin creates or edits a Playground document in Payload.
2. The shared editor exposes generated tools allowed on the Playground surface.
3. Payload stores each tool instance as a normal Lexical block node inside the
   document’s content JSON.
4. Public queries select published documents only.
5. `RichContent` finds the block slug in the generated client registry, applies its
   width wrapper, and renders the tool with the saved fields.
6. Reader edits inside an interactive tool remain local UI state unless a future tool
   explicitly defines persistence.

## Failure handling

- Duplicate slugs receive the same collision-safe suffix behavior used by Blog.
- Publication fails when required Playground fields are missing.
- A stale generated registry is a validation failure, caught before deployment.
- An unknown or retired block does not take down the surrounding content.
- Tool renderers should provide a bounded error state when their saved configuration
  is invalid.
- Registry generation validates duplicate slugs, unsupported surfaces, invalid width
  values, and missing server/client entry files.

## Verification

Implementation verification should cover:

- registry generation and stale-output detection;
- duplicate tool slug and invalid manifest failures;
- Blog, TIL, and Playground editor composition from the same registry;
- rendering an existing `vector2dPlayground` node after its files move;
- published-only Playground queries and stable slug/publication behavior;
- prose and wide tool geometry at mobile, reading-column, and desktop widths;
- Blog/TIL standalone details plus their modal constraints;
- TypeScript, ESLint, generated Payload types, and `git diff --check`.

Do not run a production build while the user’s development server is active unless
they request it.

## Implementation sequence

1. Introduce the tool package contract, generator, registries, and validation.
2. Move Vector 2D Playground without changing its stored slug or behavior.
3. Replace Blog/TIL block arrays and hard-coded converters with shared factories.
4. Add the Playground collection, migration, generated Payload types, and queries.
5. Add list/detail routes and the narrow-prose/wide-tool layout contract.
6. Run scoped static and browser verification before any production database action.
