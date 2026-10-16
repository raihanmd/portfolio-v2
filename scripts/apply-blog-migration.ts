import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import { Client } from "pg";
import type { MigrateUpArgs } from "@payloadcms/db-postgres";

import { up } from "../src/migrations/20261015_150303_blog_collections";

const projectMigration = "20261004_090341_projects_and_project_media";
const blogMigration = "20261015_150303_blog_collections";
const projectTables = [
  "projects",
  "projects_category",
  "projects_tags",
  "projects_videos",
  "projects_images",
  "projects_links",
  "_projects_v",
  "project_media",
];
const blogTables = [
  "blogs",
  "_blogs_v",
  "blog_categories",
  "blog_series",
  "blog_media",
];

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");

const client = new Client({ connectionString });

async function checkBaseline(): Promise<void> {
  const history = await client.query<{ name: string; batch: string }>(
    "SELECT name, batch FROM payload_migrations ORDER BY id",
  );
  if (
    history.rows.length !== 1 ||
    history.rows[0]?.name !== "dev" ||
    Number(history.rows[0].batch) !== -1
  ) {
    throw new Error(
      "Migration history differs from the reviewed production baseline.",
    );
  }

  const tables = await client.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
    [[...projectTables, ...blogTables]],
  );
  const existing = new Set(tables.rows.map((row) => row.table_name));
  const missingProjects = projectTables.filter((table) => !existing.has(table));
  const existingBlogs = blogTables.filter((table) => existing.has(table));
  if (missingProjects.length || existingBlogs.length) {
    throw new Error(
      `Unexpected schema: missing project tables [${missingProjects.join(", ")}], existing blog tables [${existingBlogs.join(", ")}].`,
    );
  }

  const relations = await client.query<{ column_name: string }>(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'payload_locked_documents_rels'
       AND column_name = ANY($1::text[])`,
    [["projects_id", "project_media_id", "blogs_id", "blog_media_id"]],
  );
  const columns = new Set(relations.rows.map((row) => row.column_name));
  if (
    !columns.has("projects_id") ||
    !columns.has("project_media_id") ||
    columns.has("blogs_id") ||
    columns.has("blog_media_id")
  ) {
    throw new Error(
      "Payload locked-document relations differ from the reviewed baseline.",
    );
  }
}

async function main(): Promise<void> {
  await client.connect();
  try {
    await checkBaseline();
    if (!process.argv.includes("--apply")) {
      console.log("Preflight passed. No database changes were made.");
      return;
    }

    await client.query("BEGIN");
    try {
      await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
        "portfolio-v2-blog-migration",
      ]);
      await checkBaseline();

      // The existing project schema came from Payload's development push.
      // Record its matching migration as a baseline before adding blog tables.
      await client.query(
        "INSERT INTO payload_migrations (name, batch) VALUES ($1, 1)",
        [projectMigration],
      );

      const dialect = new PgDialect();
      const db = {
        execute: async (statement: SQL) => {
          const query = dialect.sqlToQuery(statement);
          return client.query(query.sql, query.params);
        },
      } as unknown as MigrateUpArgs["db"];
      await up({ db } as MigrateUpArgs);

      await client.query(
        "INSERT INTO payload_migrations (name, batch) VALUES ($1, 2)",
        [blogMigration],
      );
      await client.query(
        "DELETE FROM payload_migrations WHERE name = 'dev' AND batch = -1",
      );
      await client.query("COMMIT");
      console.log("Blog migration applied and migration history baselined.");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  } finally {
    await client.end();
  }
}

await main();
