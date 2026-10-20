import {
  sql,
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_playgrounds_status" AS ENUM('draft', 'published');
    CREATE TYPE "public"."enum__playgrounds_v_version_status" AS ENUM('draft', 'published');

    CREATE TABLE "playgrounds" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "slug" varchar,
      "description" varchar,
      "content" jsonb,
      "published_at" timestamp(3) with time zone,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "_status" "enum_playgrounds_status" DEFAULT 'draft'
    );

    CREATE TABLE "_playgrounds_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_name" varchar,
      "version_slug" varchar,
      "version_description" varchar,
      "version_content" jsonb,
      "version_published_at" timestamp(3) with time zone,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "version__status" "enum__playgrounds_v_version_status" DEFAULT 'draft',
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "latest" boolean,
      "autosave" boolean
    );

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "playgrounds_id" integer;
    ALTER TABLE "_playgrounds_v" ADD CONSTRAINT "_playgrounds_v_parent_id_playgrounds_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."playgrounds"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_playgrounds_fk" FOREIGN KEY ("playgrounds_id") REFERENCES "public"."playgrounds"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "playgrounds_name_idx" ON "playgrounds" USING btree ("name");
    CREATE UNIQUE INDEX "playgrounds_slug_idx" ON "playgrounds" USING btree ("slug");
    CREATE INDEX "playgrounds_published_at_idx" ON "playgrounds" USING btree ("published_at");
    CREATE INDEX "playgrounds_published_cursor_idx" ON "playgrounds" USING btree ("published_at" DESC, "id" DESC) WHERE "_status" = 'published' AND "published_at" IS NOT NULL;
    CREATE INDEX "playgrounds_updated_at_idx" ON "playgrounds" USING btree ("updated_at");
    CREATE INDEX "playgrounds_created_at_idx" ON "playgrounds" USING btree ("created_at");
    CREATE INDEX "playgrounds__status_idx" ON "playgrounds" USING btree ("_status");
    CREATE INDEX "_playgrounds_v_parent_idx" ON "_playgrounds_v" USING btree ("parent_id");
    CREATE INDEX "_playgrounds_v_version_version_name_idx" ON "_playgrounds_v" USING btree ("version_name");
    CREATE INDEX "_playgrounds_v_version_version_slug_idx" ON "_playgrounds_v" USING btree ("version_slug");
    CREATE INDEX "_playgrounds_v_version_version_published_at_idx" ON "_playgrounds_v" USING btree ("version_published_at");
    CREATE INDEX "_playgrounds_v_version_version_updated_at_idx" ON "_playgrounds_v" USING btree ("version_updated_at");
    CREATE INDEX "_playgrounds_v_version_version_created_at_idx" ON "_playgrounds_v" USING btree ("version_created_at");
    CREATE INDEX "_playgrounds_v_version_version__status_idx" ON "_playgrounds_v" USING btree ("version__status");
    CREATE INDEX "_playgrounds_v_created_at_idx" ON "_playgrounds_v" USING btree ("created_at");
    CREATE INDEX "_playgrounds_v_updated_at_idx" ON "_playgrounds_v" USING btree ("updated_at");
    CREATE INDEX "_playgrounds_v_latest_idx" ON "_playgrounds_v" USING btree ("latest");
    CREATE INDEX "_playgrounds_v_autosave_idx" ON "_playgrounds_v" USING btree ("autosave");
    CREATE INDEX "payload_locked_documents_rels_playgrounds_id_idx" ON "payload_locked_documents_rels" USING btree ("playgrounds_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_playgrounds_fk";
    DROP INDEX "payload_locked_documents_rels_playgrounds_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "playgrounds_id";
    ALTER TABLE "playgrounds" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_playgrounds_v" DISABLE ROW LEVEL SECURITY;
    DROP TABLE "playgrounds" CASCADE;
    DROP TABLE "_playgrounds_v" CASCADE;
    DROP TYPE "public"."enum_playgrounds_status";
    DROP TYPE "public"."enum__playgrounds_v_version_status";
  `);
}
