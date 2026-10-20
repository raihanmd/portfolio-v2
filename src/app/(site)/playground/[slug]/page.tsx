import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/archivo";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AuroraBackground from "~/_components/ui/aurora-background";
import { SITE_CONFIG } from "~/constant/seo";
import PlaygroundDetail from "~/features/playground/components/playground-detail";
import { getPlaygroundBySlug } from "~/lib/query-playground";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const dynamic = "force-dynamic";

interface PlaygroundDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PlaygroundDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playground = await getPlaygroundBySlug(slug);
  if (!playground) return {};
  const url = `${SITE_CONFIG.url}/playground/${playground.slug}`;

  return {
    title: playground.name,
    description: playground.description,
    alternates: { canonical: url },
    openGraph: {
      title: playground.name,
      description: playground.description,
      url,
      type: "website",
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: "summary_large_image",
      title: playground.name,
      description: playground.description,
    },
  };
}

export default async function PlaygroundDetailPage({
  params,
}: PlaygroundDetailPageProps) {
  const { slug } = await params;
  const playground = await getPlaygroundBySlug(slug, {
    populateUploads: true,
  });
  if (!playground) notFound();

  const url = `${SITE_CONFIG.url}/playground/${playground.slug}`;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Playground", url: `${SITE_CONFIG.url}/playground` },
    { name: playground.name, url },
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: playground.name,
    description: playground.description,
    url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <AuroraBackground animateBackground={false}>
        <div className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-24">
          <PlaygroundDetail playground={playground} />
        </div>
      </AuroraBackground>
    </>
  );
}
