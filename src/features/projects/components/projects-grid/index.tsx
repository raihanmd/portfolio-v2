"use client";

import { useState } from "react";
import type { IProject, TProjectCategory } from "~/types";
import {
  PROJECTS,
  filterProjectsByCategory,
  sortProjects,
} from "~/constant/project";
import Each from "~/_components/each";
import ProjectCard from "../project-card";
import ProjectDetailModal from "../project-detail-modal";
import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";

interface ProjectsGridProps {
  selectedCategories: TProjectCategory[];
}

export default function ProjectsGrid({
  selectedCategories,
}: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  // Filter and sort projects
  const filteredProjects = filterProjectsByCategory(
    PROJECTS,
    selectedCategories,
  );
  const sortedProjects = sortProjects(filteredProjects);

  return (
    <>
      <div className="space-y-4">
        {/* Results Meta */}
        <AnimateItem className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {sortedProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {PROJECTS.length}
          </span>{" "}
          project{PROJECTS.length !== 1 ? "s" : ""}
          {selectedCategories.length > 0 && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-foreground">
                {selectedCategories.length}
              </span>{" "}
              categor{selectedCategories.length > 1 ? "ies" : "y"}
            </>
          )}
        </AnimateItem>

        {/* Empty State */}
        {sortedProjects.length === 0 ? (
          <AnimateItem className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No projects found in the selected categories.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Try selecting different filters.
            </p>
          </AnimateItem>
        ) : (
          /* Projects Grid */
          <AnimateFade
            delayChildren={0.1}
            staggerChildren={0.1}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-4xl"
          >
            <Each
              of={sortedProjects}
              render={(project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              )}
            />
          </AnimateFade>
        )}
      </div>

      {/* Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
