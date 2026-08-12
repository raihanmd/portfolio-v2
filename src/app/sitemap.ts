import type { MetadataRoute } from "next";
import { getPayload } from "payload";

import config from "../../payload.config";
import { SITE_CONFIG, SITE_PAGES } from "~/constant/seo";

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

  return [...staticPages, ...tilPages];
}

export const dynamic = "force-dynamic";
