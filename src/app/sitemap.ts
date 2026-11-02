import type { MetadataRoute } from "next";

import { SITE_CONFIG, SITE_PAGES } from "~/constant/seo";
import { getPublishedBlogSlugs } from "~/lib/query-blog";
import { getPublishedPlaygroundSlugs } from "~/lib/query-playground";
import { getPublishedTilSlugs } from "~/lib/query-til";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = SITE_PAGES.map((page) => ({
    url: `${baseUrl}${page.path}`,
    changeFrequency: page.changefreq as
      | "weekly"
      | "monthly"
      | "always"
      | "hourly"
      | "daily"
      | "yearly"
      | "never",
    priority: parseFloat(page.priority),
  }));

  const [tils, blogs, playgrounds] = await Promise.all([
    getPublishedTilSlugs(),
    getPublishedBlogSlugs(),
    getPublishedPlaygroundSlugs(),
  ]);

  const tilPages = tils.map((til) => ({
    url: `${baseUrl}/til/${til.slug ?? til.id}`,
    lastModified: new Date(til.updatedAt ?? til.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const playgroundPages: MetadataRoute.Sitemap = playgrounds.map((entry) => ({
    url: `${baseUrl}/playground/${entry.slug}`,
    lastModified: entry.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...tilPages, ...blogPages, ...playgroundPages];
}

export const dynamic = "force-dynamic";
