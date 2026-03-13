export type TExperience = {
  href?: string;
  country?: string;
  company: string;
  position: string;
  date_start: string;
  date_end: string;
};

/**
 * Project-related types following TypeScript best practices
 * Using literal unions for type-safety and tree-shaking
 */

export type TProjectCategory =
  | "web"
  | "web3"
  // | "game"
  // | "tool"
  // | "design"
  | "security";

export type TProjectStatus = "completed" | "in-progress" | "archived";

export type TProjectLinkType = "github" | "live" | "figma" | "docs" | "demo";

/**
 * Represents a single project link/CTA
 * Separating this interface provides flexibility for adding links data
 */
export interface IProjectLink {
  label: TProjectLinkType;
  href: string;
  icon?: React.ReactNode;
}

/**
 * Represents metrics/stats for a project
 * All optional to accommodate different project types
 */
export interface IProjectMetrics {
  downloads?: number;
  stars?: number;
  users?: number;
  forks?: number;
}

/**
 * Main Project type - comprehensive portfolio project data structure
 * Follows compound interface pattern for flexibility and composition
 */
export interface IProject {
  // Identifiers
  id: string;

  // Content
  title: string;
  description: string; // Short description for card
  longDescription?: string; // Detailed description for modal/page

  // Classification
  category: TProjectCategory[];
  status: TProjectStatus;
  tags: string[]; // Technologies/tools used (React, TypeScript, etc.)

  // Visuals
  image?: string; // Hero image URL
  thumbnail?: string; // Card thumbnail URL
  color?: string; // Accent color for card styling

  // Metadata
  featured: boolean; // Pin to top of projects
  year: number; // Release/creation year
  order?: number; // Manual ordering within featured/non-featured

  // Links & CTAs
  links: IProjectLink[];

  video?: string;

  // Analytics
  metrics?: IProjectMetrics;
}

// Export type alias for backwards compatibility with naming convention
export type TProject = IProject;
