import type { Metadata } from "next";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";
import { Separator } from "~/_components/ui/separator";
import ProjectsFeature from "~/features/projects";

export const metadata: Metadata = {
  title: "Raihanmd | Projects",
  description: "Portfolio of projects and works",
};

export default function ProjectsPage() {
  return (
    <AuroraBackground>
      <AnimateFade
        staggerChildren={0.3}
        className="container mx-auto h-full px-6 pt-16 lg:px-0"
      >
        <ProjectsFeature />
        <Separator decorative />
      </AnimateFade>
    </AuroraBackground>
  );
}
