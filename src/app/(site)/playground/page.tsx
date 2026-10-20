import type { Metadata } from "next";

import AnimateFade from "~/_components/animate-fade";
import AuroraBackground from "~/_components/ui/aurora-background";
import { PAGE_SEO, SITE_CONFIG } from "~/constant/seo";
import PlaygroundFeature from "~/features/playground";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: PAGE_SEO.playground.title,
  description: PAGE_SEO.playground.description,
  alternates: { canonical: `${SITE_CONFIG.url}/playground` },
  openGraph: {
    title: PAGE_SEO.playground.title,
    description: PAGE_SEO.playground.description,
    url: `${SITE_CONFIG.url}/playground`,
  },
  twitter: {
    title: PAGE_SEO.playground.title,
    description: PAGE_SEO.playground.description,
  },
};

export default function PlaygroundPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Playground", url: `${SITE_CONFIG.url}/playground` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AuroraBackground
        animateBackground={false}
        className="h-auto min-h-screen"
      >
        <AnimateFade
          staggerChildren={0.3}
          className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-16"
        >
          <PlaygroundFeature />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
