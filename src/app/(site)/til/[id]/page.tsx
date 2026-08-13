import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import AnimateFade from "~/_components/animate-fade";
import AuroraBackground from "~/_components/ui/aurora-background";
import { PAGE_SEO, SITE_CONFIG } from "~/constant/seo";
import { fetchTilFast } from "~/lib/query-til";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";
import { formatTilDate } from "~/lib/til-date";
import { extractTilText, truncateText } from "~/lib/til-text";
import TilDetail from "~/features/til/components/til-detail";

export const dynamic = "force-dynamic";

interface TilDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TilDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const til = await fetchTilFast(id);
  if (!til) return {};

  const title = `TIL · ${formatTilDate(til.date)}`;
  const url = `${SITE_CONFIG.url}/til/${til.slug ?? id}`;
  const snippet = truncateText(extractTilText(til.content));
  const description = snippet || PAGE_SEO.til.description;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: SITE_CONFIG.name,
      publishedTime: til.date,
      modifiedTime: til.updatedAt,
      authors: [SITE_CONFIG.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TilDetailPage({
  params,
}: TilDetailPageProps) {
  const { id } = await params;
  const til = await fetchTilFast(id);
  if (!til) notFound();

  // Canonicalize legacy /til/<id> URLs to the date slug with a permanent
  // redirect: one canonical URL per TIL, and old shares/crawlers get updated.
  // Skipped when the slug is still NULL (pre-backfill rows keep id URLs).
  if (til.slug && id !== til.slug) {
    permanentRedirect(`/til/${til.slug}`);
  }

  const url = `${SITE_CONFIG.url}/til/${til.slug ?? id}`;
  const title = `TIL · ${formatTilDate(til.date)}`;
  const snippet = truncateText(extractTilText(til.content));
  const description = snippet || PAGE_SEO.til.description;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "TIL", url: `${SITE_CONFIG.url}/til` },
    {
      name: formatTilDate(til.date),
      url: `${SITE_CONFIG.url}/til/${til.slug ?? id}`,
    },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: til.date,
    dateModified: til.updatedAt,
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <AuroraBackground>
        <AnimateFade
          staggerChildren={0.3}
          className="container mx-auto h-full px-6 pt-24 lg:px-0"
        >
          <TilDetail til={til} />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
