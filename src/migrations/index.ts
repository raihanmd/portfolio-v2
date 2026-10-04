import * as migration_20261004_090341_projects_and_project_media from './20261004_090341_projects_and_project_media';

export const migrations = [
  {
    up: migration_20261004_090341_projects_and_project_media.up,
    down: migration_20261004_090341_projects_and_project_media.down,
    name: '20261004_090341_projects_and_project_media'
  },
];
