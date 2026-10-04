"use client";

import Link from "next/link";
import { memo } from "react";
import type { IProject } from "~/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Badge } from "~/_components/ui/badge";
import AnimateItem from "~/_components/animate-item";
import Each from "~/_components/each";
import { PROJECT_CATEGORIES } from "~/constant/project";
import {
  GithubIcon,
  ExternalLinkIcon,
  FigmaIcon,
  FileTextIcon,
} from "lucide-react";
import { Button } from "~/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/_components/ui/tooltip";
import ProjectMediaCarousel from "../project-media-carousel";

interface ProjectCardProps {
  project: IProject;
  onClick?: () => void;
}

function getLinkIcon(type: IProject["links"][number]["label"]) {
  const iconMap = {
    github: GithubIcon,
    live: ExternalLinkIcon,
    demo: ExternalLinkIcon,
    figma: FigmaIcon,
    docs: FileTextIcon,
  };
  return iconMap[type] || ExternalLinkIcon;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <AnimateItem>
      <Card
        className="group relative -mx-0 h-full cursor-pointer overflow-hidden border-dashed transition-all hover:border-primary/40 hover:shadow-lg"
        onClick={onClick}
      >
        <ProjectMediaCarousel media={project.media} title={project.title} />

        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="flex flex-1 flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-base">
              {project.title}
            </CardTitle>
          </div>

          {/* Status Badge */}
          {project.featured && (
            <Badge variant={"success"} className="ml-2 shrink-0">
              Featured
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>

          {/* Year */}
          <p className="text-xs text-muted-foreground/60">{project.year}</p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            <Each
              of={project.category}
              render={(cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="bg-muted/50 text-xs"
                >
                  {PROJECT_CATEGORIES[cat].label}
                </Badge>
              )}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Each
              of={project.tags.slice(0, 4)}
              render={(tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary/80"
                >
                  {tag}
                </span>
              )}
            />
            {project.tags.length > 4 && (
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary/80">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
              {project.metrics.users && (
                <div>
                  <span className="font-semibold">{project.metrics.users}</span>{" "}
                  users
                </div>
              )}
              {project.metrics.stars && (
                <div>
                  <span className="font-semibold">{project.metrics.stars}</span>{" "}
                  stars
                </div>
              )}
              {project.metrics.downloads && (
                <div>
                  <span className="font-semibold">
                    {project.metrics.downloads}+
                  </span>{" "}
                  downloads
                </div>
              )}
            </div>
          )}

          {/* Links/CTAs */}
          <div className="flex gap-2 pt-2">
            <Each
              of={project.links}
              render={(link) => {
                const Icon = getLinkIcon(link.label);
                return (
                  <TooltipProvider key={link.label} disableHoverableContent>
                    <Tooltip delayDuration={200}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8"
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Icon className="size-4" />
                            <span className="sr-only">{link.label}</span>
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="capitalize">
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                onClick?.();
              }}
              className="ml-auto focus-visible:ring-2 focus-visible:ring-ring"
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </AnimateItem>
  );
}

export default memo(ProjectCard);
