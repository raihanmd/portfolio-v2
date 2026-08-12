import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AnimateFade from "~/_components/animate-fade";
import AuroraBackground from "~/_components/ui/aurora-background";
import { PAGE_SEO, SITE_CONFIG } from "~/constant/seo";
import { fetchTilById } from "~/lib/fetch-til";
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
  const til = await fetchTilById(id);
  if (!til) return {};

  const title = `TIL · ${formatTilDate(til.date)}`;
  const url = `${SITE_CONFIG.url}/til/${id}`;
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
  const til = await fetchTilById(id);
  if (!til) notFound();

  const url = `${SITE_CONFIG.url}/til/${id}`;
  const title = `TIL · ${formatTilDate(til.date)}`;
  const snippet = truncateText(extractTilText(til.content));
  const description = snippet || PAGE_SEO.til.description;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "TIL", url: `${SITE_CONFIG.url}/til` },
    {
      name: formatTilDate(til.date),
      url: `${SITE_CONFIG.url}/til/${id}`,
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
