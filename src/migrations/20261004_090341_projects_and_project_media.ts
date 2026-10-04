import { type MigrateUpArgs, type MigrateDownArgs, sql } from "@payloadcms/db-postgres";

// Adds only project storage. Existing users, TILs, experiences, and their
// version snapshots are intentionally outside this migration.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_projects_category" AS ENUM('web', 'web3', 'security');
  CREATE TYPE "public"."enum_projects_videos_source" AS ENUM('youtube', 'upload');
  CREATE TYPE "public"."enum_projects_links_label" AS ENUM('github', 'live', 'figma', 'docs', 'demo');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('completed', 'in-progress', 'archived');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_category" AS ENUM('web', 'web3', 'security');
  CREATE TYPE "public"."enum__projects_v_version_videos_source" AS ENUM('youtube', 'upload');
  CREATE TYPE "public"."enum__projects_v_version_links_label" AS ENUM('github', 'live', 'figma', 'docs', 'demo');
  CREATE TYPE "public"."enum__projects_v_version_project_status" AS ENUM('completed', 'in-progress', 'archived');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_category" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum_projects_category",
    "id" serial PRIMARY KEY NOT NULL
  );
  CREATE TABLE "projects_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar
  );
  CREATE TABLE "projects_videos" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "source" "enum_projects_videos_source" DEFAULT 'youtube',
    "youtube_url" varchar,
    "file_id" integer
  );
  CREATE TABLE "projects_images" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "image_id" integer
  );
  CREATE TABLE "projects_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" "enum_projects_links_label",
    "href" varchar
  );
  CREATE TABLE "projects" (
    "id" serial PRIMARY KEY NOT NULL,
    "slug" varchar,
    "title" varchar,
    "description" varchar,
    "long_description" varchar,
    "project_status" "enum_projects_project_status" DEFAULT 'completed',
    "featured" boolean DEFAULT false,
    "year" numeric,
    "order" numeric,
    "metrics_users" numeric,
    "metrics_stars" numeric,
    "metrics_downloads" numeric,
    "metrics_forks" numeric,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "_status" "enum_projects_status" DEFAULT 'draft'
  );
  CREATE TABLE "_projects_v_version_category" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" "enum__projects_v_version_category",
    "id" serial PRIMARY KEY NOT NULL
  );
  CREATE TABLE "_projects_v_version_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "_uuid" varchar
  );
  CREATE TABLE "_projects_v_version_videos" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "source" "enum__projects_v_version_videos_source" DEFAULT 'youtube',
    "youtube_url" varchar,
    "file_id" integer,
    "_uuid" varchar
  );
  CREATE TABLE "_projects_v_version_images" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "image_id" integer,
    "_uuid" varchar
  );
  CREATE TABLE "_projects_v_version_links" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" "enum__projects_v_version_links_label",
    "href" varchar,
    "_uuid" varchar
  );
  CREATE TABLE "_projects_v" (
    "id" serial PRIMARY KEY NOT NULL,
    "parent_id" integer,
    "version_slug" varchar,
    "version_title" varchar,
    "version_description" varchar,
    "version_long_description" varchar,
    "version_project_status" "enum__projects_v_version_project_status" DEFAULT 'completed',
    "version_featured" boolean DEFAULT false,
    "version_year" numeric,
    "version_order" numeric,
    "version_metrics_users" numeric,
    "version_metrics_stars" numeric,
    "version_metrics_downloads" numeric,
    "version_metrics_forks" numeric,
    "version_updated_at" timestamp(3) with time zone,
    "version_created_at" timestamp(3) with time zone,
    "version__status" "enum__projects_v_version_status" DEFAULT 'draft',
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "latest" boolean
  );
  CREATE TABLE "project_media" (
    "id" serial PRIMARY KEY NOT NULL,
    "alt" varchar,
    "prefix" varchar DEFAULT 'projects',
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
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "project_media_id" integer;
  ALTER TABLE "projects_category" ADD CONSTRAINT "projects_category_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_tags" ADD CONSTRAINT "projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_videos" ADD CONSTRAINT "projects_videos_file_id_project_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_videos" ADD CONSTRAINT "projects_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_image_id_project_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_images" ADD CONSTRAINT "projects_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_links" ADD CONSTRAINT "projects_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_category" ADD CONSTRAINT "_projects_v_version_category_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_tags" ADD CONSTRAINT "_projects_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_videos" ADD CONSTRAINT "_projects_v_version_videos_file_id_project_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_videos" ADD CONSTRAINT "_projects_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_images" ADD CONSTRAINT "_projects_v_version_images_image_id_project_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_images" ADD CONSTRAINT "_projects_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_links" ADD CONSTRAINT "_projects_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_media_fk" FOREIGN KEY ("project_media_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_category_order_idx" ON "projects_category" USING btree ("order");
  CREATE INDEX "projects_category_parent_idx" ON "projects_category" USING btree ("parent_id");
  CREATE INDEX "projects_tags_order_idx" ON "projects_tags" USING btree ("_order");
  CREATE INDEX "projects_tags_parent_id_idx" ON "projects_tags" USING btree ("_parent_id");
  CREATE INDEX "projects_videos_order_idx" ON "projects_videos" USING btree ("_order");
  CREATE INDEX "projects_videos_parent_id_idx" ON "projects_videos" USING btree ("_parent_id");
  CREATE INDEX "projects_videos_file_idx" ON "projects_videos" USING btree ("file_id");
  CREATE INDEX "projects_images_order_idx" ON "projects_images" USING btree ("_order");
  CREATE INDEX "projects_images_parent_id_idx" ON "projects_images" USING btree ("_parent_id");
  CREATE INDEX "projects_images_image_idx" ON "projects_images" USING btree ("image_id");
  CREATE INDEX "projects_links_order_idx" ON "projects_links" USING btree ("_order");
  CREATE INDEX "projects_links_parent_id_idx" ON "projects_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_category_order_idx" ON "_projects_v_version_category" USING btree ("order");
  CREATE INDEX "_projects_v_version_category_parent_idx" ON "_projects_v_version_category" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_tags_order_idx" ON "_projects_v_version_tags" USING btree ("_order");
  CREATE INDEX "_projects_v_version_tags_parent_id_idx" ON "_projects_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_videos_order_idx" ON "_projects_v_version_videos" USING btree ("_order");
  CREATE INDEX "_projects_v_version_videos_parent_id_idx" ON "_projects_v_version_videos" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_videos_file_idx" ON "_projects_v_version_videos" USING btree ("file_id");
  CREATE INDEX "_projects_v_version_images_order_idx" ON "_projects_v_version_images" USING btree ("_order");
  CREATE INDEX "_projects_v_version_images_parent_id_idx" ON "_projects_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_images_image_idx" ON "_projects_v_version_images" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_links_order_idx" ON "_projects_v_version_links" USING btree ("_order");
  CREATE INDEX "_projects_v_version_links_parent_id_idx" ON "_projects_v_version_links" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "project_media_updated_at_idx" ON "project_media" USING btree ("updated_at");
  CREATE INDEX "project_media_created_at_idx" ON "project_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_media_filename_idx" ON "project_media" USING btree ("filename");
  CREATE INDEX "project_media_sizes_card_sizes_card_filename_idx" ON "project_media" USING btree ("sizes_card_filename");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_media_id_idx" ON "payload_locked_documents_rels" USING btree ("project_media_id");`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "project_media_id";
  DROP TABLE "_projects_v_version_category" CASCADE;
  DROP TABLE "_projects_v_version_tags" CASCADE;
  DROP TABLE "_projects_v_version_videos" CASCADE;
  DROP TABLE "_projects_v_version_images" CASCADE;
  DROP TABLE "_projects_v_version_links" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "projects_category" CASCADE;
  DROP TABLE "projects_tags" CASCADE;
  DROP TABLE "projects_videos" CASCADE;
  DROP TABLE "projects_images" CASCADE;
  DROP TABLE "projects_links" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "project_media" CASCADE;
  DROP TYPE "public"."enum_projects_category";
  DROP TYPE "public"."enum_projects_videos_source";
  DROP TYPE "public"."enum_projects_links_label";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_category";
  DROP TYPE "public"."enum__projects_v_version_videos_source";
  DROP TYPE "public"."enum__projects_v_version_links_label";
  DROP TYPE "public"."enum__projects_v_version_project_status";
  DROP TYPE "public"."enum__projects_v_version_status";`);
}
