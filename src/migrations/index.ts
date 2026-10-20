import * as migration_20261004_090341_projects_and_project_media from "./20261004_090341_projects_and_project_media";
import * as migration_20261015_150303_blog_collections from "./20261015_150303_blog_collections";
import * as migration_20261020_120000_media_captions from "./20261020_120000_media_captions";
import * as migration_20261020_200500_playgrounds from "./20261020_200500_playgrounds";
import * as migration_20261020_204500_playgrounds_nullable_fields from "./20261020_204500_playgrounds_nullable_fields";

export const migrations = [
  {
    up: migration_20261004_090341_projects_and_project_media.up,
    down: migration_20261004_090341_projects_and_project_media.down,
    name: "20261004_090341_projects_and_project_media",
  },
  {
    up: migration_20261015_150303_blog_collections.up,
    down: migration_20261015_150303_blog_collections.down,
    name: "20261015_150303_blog_collections",
  },
  {
    up: migration_20261020_120000_media_captions.up,
    down: migration_20261020_120000_media_captions.down,
    name: "20261020_120000_media_captions",
  },
  {
    up: migration_20261020_200500_playgrounds.up,
    down: migration_20261020_200500_playgrounds.down,
    name: "20261020_200500_playgrounds",
  },
  {
    up: migration_20261020_204500_playgrounds_nullable_fields.up,
    down: migration_20261020_204500_playgrounds_nullable_fields.down,
    name: "20261020_204500_playgrounds_nullable_fields",
  },
];
