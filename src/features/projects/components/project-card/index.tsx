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
        className="group relative -mx-0 h-full cursor-pointer overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
        onClick={onClick}
      >
        {/* Project Image */}
        {project.image && (
          <div className="relative h-40 w-full overflow-hidden bg-muted">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        )}

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
          </div>
        </CardContent>
      </Card>
    </AnimateItem>
  );
}

export default memo(ProjectCard);
