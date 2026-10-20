import {
  sql,
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_media" ADD COLUMN "caption" varchar;
    ALTER TABLE "blog_media" ADD COLUMN "caption" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "project_media" DROP COLUMN "caption";
    ALTER TABLE "blog_media" DROP COLUMN "caption";
  `);
}
