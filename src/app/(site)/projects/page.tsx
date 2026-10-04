import type { Metadata } from "next";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";
import { Separator } from "~/_components/ui/separator";
import ProjectsFeature from "~/features/projects";
import { JsonLd } from "~/_components/seo/json-ld";
import { SITE_CONFIG, PAGE_SEO } from "~/constant/seo";
import {
  generateBreadcrumbSchema,
  generateCreativeWorkSchema,
} from "~/lib/seo-schema";
import { getPublishedProjects } from "~/lib/projects";

export const dynamic = "force-dynamic";

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

const projectsBreadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: SITE_CONFIG.url },
  { name: "Projects", url: `${SITE_CONFIG.url}/projects` },
]);

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  const projectsSchema = generateCreativeWorkSchema(
    projects.map((project) => ({
      title: project.title,
      description: project.description,
      dateCreated: `${project.year}-01-01`,
    })),
  );

  return (
    <>
      <JsonLd scripts={[projectsSchema, projectsBreadcrumbSchema]} />
      <AuroraBackground>
        <AnimateFade
          staggerChildren={0.3}
          className="container mx-auto h-full px-6 pt-16 lg:px-0"
        >
          <ProjectsFeature projects={projects} />
          <Separator decorative />
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
