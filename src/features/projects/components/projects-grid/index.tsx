"use client";

import { useState } from "react";
import type { IProject, TProjectCategory } from "~/types";
import {
  filterProjectsByCategory,
} from "~/constant/project";
import Each from "~/_components/each";
import ProjectCard from "../project-card";
import ProjectDetailModal from "../project-detail-modal";
import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";

interface ProjectsGridProps {
  projects: IProject[];
  selectedCategories: TProjectCategory[];
}

export default function ProjectsGrid({
  projects,
  selectedCategories,
}: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const filteredProjects = filterProjectsByCategory(projects, selectedCategories);

  return (
    <>
      <div className="space-y-4">
        {/* Results Meta */}
        <AnimateItem className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filteredProjects.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {projects.length}
          </span>{" "}
          project{projects.length !== 1 ? "s" : ""}
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
        {filteredProjects.length === 0 ? (
          <AnimateItem className="rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              {projects.length === 0
                ? "No projects published yet."
                : "No projects found in the selected categories."}
            </p>
            {projects.length > 0 && (
              <p className="text-xs text-muted-foreground/60">
                Try selecting different filters.
              </p>
            )}
          </AnimateItem>
        ) : (
          /* Projects Grid */
          <AnimateFade
            delayChildren={0.1}
            staggerChildren={0.1}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-4xl"
          >
            <Each
              of={filteredProjects}
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
