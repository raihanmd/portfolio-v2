import type { Metadata } from "next";
import { Separator } from "~/_components/ui/separator";
import Experience from "~/features/home/components/experience";
import Service from "~/features/home/components/service";
import Headline from "~/features/home/components/headline";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";
import { SITE_CONFIG, PAGE_SEO } from "~/constant/seo";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/`,
  },
  openGraph: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    url: `${SITE_CONFIG.url}/`,
  },
  twitter: {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
  },
};

const homeBreadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: SITE_CONFIG.url },
]);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeBreadcrumbSchema),
        }}
      />
      <AuroraBackground>
        <AnimateFade
          staggerChildren={0.3}
          className="container mx-auto h-full px-6 pt-24 lg:px-0"
        >
          <Headline />
          <Separator decorative />
          <Experience />
          <Separator decorative />
          <Service />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
