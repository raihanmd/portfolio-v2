import {
  sql,
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Payload disables NOT NULL for every column of a collection that enables
  // versions.drafts, because a draft is created before any field is filled in.
  // The initial playgrounds migration was written with NOT NULL, so an empty
  // draft could not be inserted.
  await db.execute(sql`
    ALTER TABLE "playgrounds"
      ALTER COLUMN "name" DROP NOT NULL,
      ALTER COLUMN "slug" DROP NOT NULL,
      ALTER COLUMN "description" DROP NOT NULL,
      ALTER COLUMN "content" DROP NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "playgrounds"
      ALTER COLUMN "name" SET NOT NULL,
      ALTER COLUMN "slug" SET NOT NULL,
      ALTER COLUMN "description" SET NOT NULL,
      ALTER COLUMN "content" SET NOT NULL;
  `);
}
