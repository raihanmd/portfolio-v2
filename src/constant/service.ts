import { WebsiteDevelopment } from "~/app/_components/service/website-development";

export type TService = {
  badge: string;
  title: string;
  description: string;
  animation: () => JSX.Element;
};

export const SERVICE: TService[] = [
  {
    badge: "coding",
    title: "Website Development",
    description:
      "Create an epic, beautiful and powerful fullstack website using modern tech stacks.",
    animation: WebsiteDevelopment,
  },
  {
    badge: "coding",
    title: "Website Development",
    description:
      "Create an epic, beautiful and powerful fullstack website using modern tech stacks.",
    animation: WebsiteDevelopment,
  },
];
