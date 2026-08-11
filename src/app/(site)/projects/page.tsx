import type { Metadata } from "next";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";
import { Separator } from "~/_components/ui/separator";
import ProjectsFeature from "~/features/projects";
import { SITE_CONFIG, PAGE_SEO } from "~/constant/seo";
import {
  generateBreadcrumbSchema,
  generateCreativeWorkSchema,
} from "~/lib/seo-schema";
import { PROJECTS } from "~/constant/project";

export const metadata: Metadata = {
  title: PAGE_SEO.projects.title,
  description: PAGE_SEO.projects.description,
  alternates: {
    canonical: `${SITE_CONFIG.url}/projects`,
  },
  openGraph: {
    title: PAGE_SEO.projects.title,
    description: PAGE_SEO.projects.description,
    url: `${SITE_CONFIG.url}/projects`,
  },
  twitter: {
    title: PAGE_SEO.projects.title,
    description: PAGE_SEO.projects.description,
  },
};

const projectsSchema = generateCreativeWorkSchema(
  PROJECTS.map((project) => ({
    title: project.title,
    description: project.description,
    dateCreated: `${project.year}-01-01`,
  })),
);

const projectsBreadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: SITE_CONFIG.url },
  { name: "Projects", url: `${SITE_CONFIG.url}/projects` },
]);

export default function ProjectsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsBreadcrumbSchema),
        }}
      />
      <AuroraBackground>
        <AnimateFade
          staggerChildren={0.3}
          className="container mx-auto h-full px-6 pt-16 lg:px-0"
        >
          <ProjectsFeature />
          <Separator decorative />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
