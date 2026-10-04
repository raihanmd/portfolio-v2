import type { IProject, TProjectCategory } from "~/types";

export const PROJECT_CATEGORIES: Record<
  TProjectCategory,
  { label: string; color: string }
> = {
  web: { label: "Web Development", color: "bg-blue-500/20 text-blue-400" },
  web3: { label: "Web3 & Blockchain", color: "bg-amber-500/20 text-amber-400" },
  security: { label: "Security", color: "bg-gray-500/20 text-gray-400" },
};

export const CATEGORY_OPTIONS = Object.entries(PROJECT_CATEGORIES).map(
  ([key, value]) => ({ value: key as TProjectCategory, label: value.label }),
);

export function filterProjectsByCategory(
  projects: IProject[],
  categories: TProjectCategory[],
): IProject[] {
  if (categories.length === 0) return projects;
  return projects.filter((project) =>
    categories.some((category) => project.category.includes(category)),
  );
}

export function sortProjects(projects: IProject[]): IProject[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return b.year - a.year;
  });
}
