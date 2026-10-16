import type { MetadataRoute } from "next";
import { getPayload } from "payload";

import config from "../../payload.config";
import { SITE_CONFIG, SITE_PAGES } from "~/constant/seo";
import { getPublishedBlogSlugs } from "~/lib/query-blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  const staticPages = SITE_PAGES.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(page.lastmod),
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

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "tils",
    depth: 0,
    limit: 1000,
    pagination: false,
  });

  const tilPages = docs.map((til) => ({
    url: `${baseUrl}/til/${til.id}`,
    lastModified: new Date(til.updatedAt ?? til.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    blogPages = (await getPublishedBlogSlugs()).map((article) => ({
      url: `${baseUrl}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    // The additive blog migration may not be applied yet.
    console.error("Unable to load blog sitemap entries", error);
  }

  return [...staticPages, ...tilPages, ...blogPages];
}

export const dynamic = "force-dynamic";
