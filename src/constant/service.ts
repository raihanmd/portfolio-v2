import type { ComponentType } from "react";
import WebsiteDevelopment from "~/features/home/components/service/website-development";
import GameDevelopment from "~/features/home/components/service/game-development";

export type TService = {
  badges: string[];
  title: string;
  description: string;
  animation: ComponentType;
};

export const SERVICE: TService[] = [
  {
    badges: ["coding"],
    title: "Systems Architecture",
    description:
      "Design and build scalable fullstack applications with deep understanding of how data flows, systems communicate, and reliability emerges from design choices.",
    animation: WebsiteDevelopment,
  },
  {
    badges: ["coding", "arting"],
    title: "Interactive Experiences",
    description:
      "Create engaging digital experiences through game development and 3D visualization. Understanding both the creative vision and the technical constraints.",
    animation: GameDevelopment,
  },
];
