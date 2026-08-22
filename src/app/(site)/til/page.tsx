import type { Metadata } from "next";
// TIL-card-only fonts: Newsreader (Tiempos-like serif, body) + Archivo
// (Styrene-like grotesque, headings). Imported here so they only ship on /til.
import "@fontsource-variable/newsreader";
import "@fontsource-variable/archivo";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";
import TilFeature from "~/features/til";
import { SITE_CONFIG, PAGE_SEO } from "~/constant/seo";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const metadata: Metadata = {
  title: PAGE_SEO.til.title,
  description: PAGE_SEO.til.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/til`,
  },
  openGraph: {
    title: PAGE_SEO.til.title,
    description: PAGE_SEO.til.description,
    url: `${SITE_CONFIG.url}/til`,
  },
  twitter: {
    title: PAGE_SEO.til.title,
    description: PAGE_SEO.til.description,
  },
};

const tilBreadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: SITE_CONFIG.url },
  { name: "TIL", url: `${SITE_CONFIG.url}/til` },
]);

export default function TilPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tilBreadcrumbSchema),
        }}
      />
      <AuroraBackground>
        <AnimateFade
          staggerChildren={0.3}
          className="container mx-auto h-full px-6 pt-16 lg:px-0"
        >
          <TilFeature />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
