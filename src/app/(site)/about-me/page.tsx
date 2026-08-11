import { type Metadata } from "next";
import Summary from "~/features/about-me/components/summary";
import EventBadgeContainer from "~/features/about-me/components/event-badge/event-badge-container";
import Skill from "~/features/about-me/components/skill";
import { Separator } from "~/_components/ui/separator";
import GithubCalendar from "~/features/about-me/components/github-calendar";
import CTA from "~/features/about-me/components/cta";
import AnimateFade from "~/_components/animate-fade";
import { SITE_CONFIG, PAGE_SEO } from "~/constant/seo";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const metadata: Metadata = {
  title: PAGE_SEO["about-me"].title,
  description: PAGE_SEO["about-me"].description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/about-me`,
  },
  openGraph: {
    title: PAGE_SEO["about-me"].title,
    description: PAGE_SEO["about-me"].description,
    url: `${SITE_CONFIG.url}/about-me`,
  },
  twitter: {
    title: PAGE_SEO["about-me"].title,
    description: PAGE_SEO["about-me"].description,
  },
};

const aboutBreadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: SITE_CONFIG.url },
  { name: "About Me", url: `${SITE_CONFIG.url}/about-me` },
]);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutBreadcrumbSchema),
        }}
      />
      <EventBadgeContainer />
      <AnimateFade
        staggerChildren={0.2}
        className="container px-6 pt-16 lg:px-0 xl:max-w-[768px] xl:px-12 xl:backdrop-blur-sm xl:[-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] xl:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <Summary />
        <Separator decorative />
        <Skill />
        <Separator decorative />
        <GithubCalendar />
        <Separator decorative />
        <CTA />
      </AnimateFade>
    </>
  );
}
