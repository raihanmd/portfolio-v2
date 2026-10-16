# Blog CMS and storage

Payload has four blog collections: **Blog Articles**, **Blog Categories**, **Blog Series**, and **Blog Images** (`blog-media`). A Blog Image is a record in Payload's media library. Its file lives in the existing Supabase S3 bucket under the `blogs/` prefix. Project media remains in `project-media` under `projects/`. No second bucket or new storage environment variable is needed.

Create an article in Blog Articles. Enter a title and content; category, series, and cover image are optional. Upload images through Blog Images and select that collection when inserting images into the rich text editor. Save drafts as needed, then publish from Payload's status controls. The slug follows draft title edits and becomes fixed on first publication. `publishedAt` is set at that first publication and does not change on later edits or republication.

Only published articles appear on `/blog`. Articles view shows ten articles per cursor page, newest first by `publishedAt` and then ID, with title search and optional category and series filters. Series view shows every published series as a section on the same page. Sections are ordered newest first by the first article published in each series; articles inside a section are ordered newest first by their own `publishedAt`. The sticky directory links to each section on wide screens. Its search matches series names and article titles. A series without published articles stays out of public discovery.

The article cover appears above the article when present. Listing thumbnails are optional. Descriptions for listings and social metadata come from prose in the editor; code blocks and images are skipped. Standalone article views are counted once per browser session after a short delay and are shown only in Payload admin.

## Production schema migration

The PostgreSQL adapter uses `push: false`, so running `bun dev` does not change the production schema. The new migration is `src/migrations/20261015_150303_blog_collections.ts`; it adds the blog tables, version table, relation columns, and indexes. It does not change existing content tables.

Before the 2026-10-15 production migration, the history contained only Payload's `dev` marker from earlier schema pushes, although the project tables already existed. Running `payload migrate` directly then would have tried the older project migration again. `scripts/apply-blog-migration.ts` checks that exact old baseline. Without arguments it performs a read-only preflight:

```bash
bun scripts/apply-blog-migration.ts
```

For a database with that exact old baseline, apply the migration only after reviewing the target database:

```bash
bun scripts/apply-blog-migration.ts --apply
```

The apply mode uses one transaction: record the existing project schema as migration batch 1, create only the new blog schema, record that as batch 2, then remove the obsolete `dev` marker. Any failure rolls back the entire transaction. It aborts if the current schema or migration history differs from the reviewed baseline.

This one-time procedure was applied to the production database on 2026-10-15. A read-only check confirmed both migration records, all five blog tables, and the published-cursor index. The script will now reject a repeat apply against production. On a fresh database, use Payload's normal migration runner to apply the project and blog migrations in order.
