-- Seed the experiences Payload collection.
-- Payload Postgres adapter uses integer autoincrement for the id column.
-- Columns: id, company, href, country, position, is_current, date_start, date_end, created_at, updated_at
-- Run after restarting dev (so the table exists):
--   set -a; source .env; set +a
--   psql "$DATABASE_URL" -f scripts/seed-experiences.sql

INSERT INTO "experiences" ("company", "href", "country", "position", "is_current", "date_start", "date_end", "created_at", "updated_at")
VALUES
  ('Chained !P', 'https://www.chained-ip.com', 'Germany', 'Frontend Developer', true,  '2025-03-01', NULL, NOW(), NOW()),
  ('PT Tonekan Niat Baikmu', NULL, 'Indonesia', 'DevOps, Fullstack Web Developer', true,  '2024-11-01', NULL, NOW(), NOW()),
  ('Bumi Pakarangan Ciamis', NULL, NULL, 'Fullstack Web Developer', false, '2023-10-01', '2023-12-31', NOW(), NOW());
