import {
  sql,
  type MigrateUpArgs,
  type MigrateDownArgs,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blogs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__blogs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blog_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"prefix" varchar DEFAULT 'blogs',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "blogs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"series_id" integer,
  	"cover_id" integer,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"views" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_blogs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_blogs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_series_id" integer,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_views" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__blogs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_series_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_media_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blogs_id" integer;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_category_id_blog_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_series_id_blog_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."blog_series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blogs" ADD CONSTRAINT "blogs_cover_id_blog_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_parent_id_blogs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blogs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_category_id_blog_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_series_id_blog_series_id_fk" FOREIGN KEY ("version_series_id") REFERENCES "public"."blog_series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_blogs_v" ADD CONSTRAINT "_blogs_v_version_cover_id_blog_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."blog_media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "blog_categories_name_idx" ON "blog_categories" USING btree ("name");
  CREATE INDEX "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_series_name_idx" ON "blog_series" USING btree ("name");
  CREATE INDEX "blog_series_updated_at_idx" ON "blog_series" USING btree ("updated_at");
  CREATE INDEX "blog_series_created_at_idx" ON "blog_series" USING btree ("created_at");
  CREATE INDEX "blog_media_updated_at_idx" ON "blog_media" USING btree ("updated_at");
  CREATE INDEX "blog_media_created_at_idx" ON "blog_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "blog_media_filename_idx" ON "blog_media" USING btree ("filename");
  CREATE INDEX "blog_media_sizes_card_sizes_card_filename_idx" ON "blog_media" USING btree ("sizes_card_filename");
  CREATE INDEX "blogs_title_idx" ON "blogs" USING btree ("title");
  CREATE UNIQUE INDEX "blogs_slug_idx" ON "blogs" USING btree ("slug");
  CREATE INDEX "blogs_category_idx" ON "blogs" USING btree ("category_id");
  CREATE INDEX "blogs_series_idx" ON "blogs" USING btree ("series_id");
  CREATE INDEX "blogs_cover_idx" ON "blogs" USING btree ("cover_id");
  CREATE INDEX "blogs_published_at_idx" ON "blogs" USING btree ("published_at");
  CREATE INDEX "blogs_published_cursor_idx" ON "blogs" USING btree ("published_at" DESC, "id" DESC) WHERE "_status" = 'published' AND "published_at" IS NOT NULL;
  CREATE INDEX "blogs_updated_at_idx" ON "blogs" USING btree ("updated_at");
  CREATE INDEX "blogs_created_at_idx" ON "blogs" USING btree ("created_at");
  CREATE INDEX "blogs__status_idx" ON "blogs" USING btree ("_status");
  CREATE INDEX "_blogs_v_parent_idx" ON "_blogs_v" USING btree ("parent_id");
  CREATE INDEX "_blogs_v_version_version_title_idx" ON "_blogs_v" USING btree ("version_title");
  CREATE INDEX "_blogs_v_version_version_slug_idx" ON "_blogs_v" USING btree ("version_slug");
  CREATE INDEX "_blogs_v_version_version_category_idx" ON "_blogs_v" USING btree ("version_category_id");
  CREATE INDEX "_blogs_v_version_version_series_idx" ON "_blogs_v" USING btree ("version_series_id");
  CREATE INDEX "_blogs_v_version_version_cover_idx" ON "_blogs_v" USING btree ("version_cover_id");
  CREATE INDEX "_blogs_v_version_version_published_at_idx" ON "_blogs_v" USING btree ("version_published_at");
  CREATE INDEX "_blogs_v_version_version_updated_at_idx" ON "_blogs_v" USING btree ("version_updated_at");
  CREATE INDEX "_blogs_v_version_version_created_at_idx" ON "_blogs_v" USING btree ("version_created_at");
  CREATE INDEX "_blogs_v_version_version__status_idx" ON "_blogs_v" USING btree ("version__status");
  CREATE INDEX "_blogs_v_created_at_idx" ON "_blogs_v" USING btree ("created_at");
  CREATE INDEX "_blogs_v_updated_at_idx" ON "_blogs_v" USING btree ("updated_at");
  CREATE INDEX "_blogs_v_latest_idx" ON "_blogs_v" USING btree ("latest");
  CREATE INDEX "_blogs_v_autosave_idx" ON "_blogs_v" USING btree ("autosave");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_series_fk" FOREIGN KEY ("blog_series_id") REFERENCES "public"."blog_series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_media_fk" FOREIGN KEY ("blog_media_id") REFERENCES "public"."blog_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blogs_fk" FOREIGN KEY ("blogs_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX "payload_locked_documents_rels_blog_series_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_series_id");
  CREATE INDEX "payload_locked_documents_rels_blog_media_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_media_id");
  CREATE INDEX "payload_locked_documents_rels_blogs_id_idx" ON "payload_locked_documents_rels" USING btree ("blogs_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_categories_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_series_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_media_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blogs_fk";
  DROP INDEX "payload_locked_documents_rels_blog_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_series_id_idx";
  DROP INDEX "payload_locked_documents_rels_blog_media_id_idx";
  DROP INDEX "payload_locked_documents_rels_blogs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_series_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_media_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blogs_id";
  ALTER TABLE "blog_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_series" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blog_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blogs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_blogs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog_series" CASCADE;
  DROP TABLE "blog_media" CASCADE;
  DROP TABLE "blogs" CASCADE;
  DROP TABLE "_blogs_v" CASCADE;
  DROP TYPE "public"."enum_blogs_status";
  DROP TYPE "public"."enum__blogs_v_version_status";`);
}
