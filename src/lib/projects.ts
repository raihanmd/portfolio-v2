import "server-only";

import { getPayload } from "payload";
import type { Project, ProjectMedia } from "../../payload-types";
import config from "../../payload.config";
import { sortProjects } from "~/constant/project";
import { getYouTubeVideoId } from "~/lib/youtube";
import type { IProject, IProjectMedia, TProjectCategory } from "~/types";

function mediaDocument(value: number | ProjectMedia | null | undefined) {
  return value && typeof value === "object" ? value : null;
}

function mapProject(project: Project): IProject {
  const media: IProjectMedia[] = [];

  for (const video of project.videos ?? []) {
    if (video.source === "youtube" && video.youtubeUrl) {
      const id = getYouTubeVideoId(video.youtubeUrl);
      if (id) {
        media.push({
          type: "youtube",
          src: `https://www.youtube-nocookie.com/embed/${id}`,
          poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
          alt: `${project.title} video`,
        });
      }
    } else if (video.source === "upload") {
      const file = mediaDocument(video.file);
      if (file?.url && file.mimeType?.startsWith("video/")) {
        media.push({ type: "video", src: file.url, alt: `${project.title} video` });
      }
    }
  }

  for (const item of project.images ?? []) {
    const file = mediaDocument(item.image);
    if (file?.url && file.mimeType?.startsWith("image/")) {
      media.push({
        type: "image",
        src: file.sizes?.card?.url ?? file.url,
        alt: file.alt ?? project.title,
      });
    }
  }

  const metrics = project.metrics;
  const hasMetrics = Boolean(
    metrics &&
      [metrics.users, metrics.stars, metrics.downloads, metrics.forks].some(
        (value) => typeof value === "number",
      ),
  );

  return {
    id: String(project.id),
    title: project.title,
    description: project.description,
    longDescription: project.longDescription ?? undefined,
    category: (project.category ?? []) as TProjectCategory[],
    status: project.projectStatus,
    tags: (project.tags ?? []).map((tag) => tag.name),
    media,
    featured: Boolean(project.featured),
    year: project.year,
    order: project.order ?? undefined,
    links: (project.links ?? []).map(({ label, href }) => ({ label, href })),
    metrics: hasMetrics
      ? {
          users: metrics?.users ?? undefined,
          stars: metrics?.stars ?? undefined,
          downloads: metrics?.downloads ?? undefined,
          forks: metrics?.forks ?? undefined,
        }
      : undefined,
  };
}

export async function getPublishedProjects(): Promise<IProject[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "projects",
    where: { _status: { equals: "published" } },
    draft: false,
    overrideAccess: false,
    pagination: false,
    depth: 2,
  });
  return sortProjects(result.docs.map(mapProject));
}
