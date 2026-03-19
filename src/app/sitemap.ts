import { MetadataRoute } from "next";
import { SITE_CONFIG, SITE_PAGES } from "~/constant/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return staticPages;
}

export const dynamic = "force-static";
