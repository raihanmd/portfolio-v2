"use client";

import { useState } from "react";
import { CodeIcon } from "@radix-ui/react-icons";
import type { TProjectCategory } from "~/types";
import AnimateItem from "~/_components/animate-item";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import ProjectFilter from "./components/project-filter";
import ProjectsGrid from "./components/projects-grid";

export default function ProjectsFeature() {
  const [selectedCategories, setSelectedCategories] = useState<
    TProjectCategory[]
  >([]);

  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          Icon={CodeIcon}
          title="My Projects"
          description="Showcasing my work across different domains"
        />
        <SectionContent className="space-y-6">
          {/* Filter Section */}
          <ProjectFilter onFilterChange={setSelectedCategories} />

          {/* Projects Grid */}
          <ProjectsGrid selectedCategories={selectedCategories} />
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
