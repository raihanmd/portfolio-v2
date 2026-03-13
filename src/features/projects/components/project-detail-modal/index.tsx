"use client";

import type { IProject } from "~/types";
import { Button } from "~/_components/ui/button";
import { Badge } from "~/_components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "~/_components/ui/dialog";
import { ScrollArea } from "~/_components/ui/scroll-area";
import { PROJECT_CATEGORIES } from "~/constant/project";
import Each from "~/_components/each";
import Link from "next/link";
import { ExternalLink, Github, Figma, FileText } from "lucide-react";

interface ProjectDetailModalProps {
  project: IProject | null;
  isOpen: boolean;
  onClose: () => void;
}

function getLinkIcon(type: IProject["links"][number]["label"]) {
  const iconMap = {
    github: Github,
    live: ExternalLink,
    demo: ExternalLink,
    figma: Figma,
    docs: FileText,
  };
  return iconMap[type] || ExternalLink;
}

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="hidden" />
        <div className="space-y-6 py-6">
          {/* Hero Image */}
          {project.image && (
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={project.image}
                alt={project.title}
                className="h-64 w-full object-cover sm:h-96"
              />
            </div>
          )}
          {project.video && (
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={project.video}
                  title={`${project.title} demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              {project.featured && <span className="text-2xl">★</span>}
            </div>
            <p className="text-lg text-muted-foreground">
              {project.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{project.year}</span>
            <span>•</span>
            <Badge variant="outline">{project.status}</Badge>
          </div>

          {/* Long Description */}
          {project.longDescription && (
            <div className="space-y-2">
              <h2 className="font-semibold">About</h2>
              <p className="leading-relaxed text-muted-foreground">
                {project.longDescription}
              </p>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Each
                of={project.category}
                render={(cat) => (
                  <Badge key={cat} variant="secondary">
                    {PROJECT_CATEGORIES[cat].label}
                  </Badge>
                )}
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <h3 className="font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              <Each
                of={project.tags}
                render={(tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary/80"
                  >
                    {tag}
                  </span>
                )}
              />
            </div>
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="space-y-2">
              <h3 className="font-semibold">Impact</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.metrics.users && (
                  <div>
                    <p className="text-2xl font-bold">
                      {project.metrics.users}+
                    </p>
                    <p className="text-sm text-muted-foreground">Users</p>
                  </div>
                )}
                {project.metrics.stars && (
                  <div>
                    <p className="text-2xl font-bold">
                      {project.metrics.stars}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      GitHub Stars
                    </p>
                  </div>
                )}
                {project.metrics.downloads && (
                  <div>
                    <p className="text-2xl font-bold">
                      {project.metrics.downloads}+
                    </p>
                    <p className="text-sm text-muted-foreground">Downloads</p>
                  </div>
                )}
                {project.metrics.forks && (
                  <div>
                    <p className="text-2xl font-bold">
                      {project.metrics.forks}
                    </p>
                    <p className="text-sm text-muted-foreground">Forks</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            <h3 className="font-semibold">Links</h3>
            <div className="flex flex-wrap gap-2">
              <Each
                of={project.links}
                render={(link) => {
                  const Icon = getLinkIcon(link.label);
                  return (
                    <Button
                      key={link.label}
                      variant="outline"
                      asChild
                      className="gap-2"
                    >
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="size-4" />
                        {link.label.charAt(0).toUpperCase() +
                          link.label.slice(1)}
                      </Link>
                    </Button>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
