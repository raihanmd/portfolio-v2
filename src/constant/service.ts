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
    title: "Web Development",
    description:
      "Design and build scalable fullstack applications with deep understanding of how data flows, and systems communicate.",
    animation: WebsiteDevelopment,
  },
  {
    badges: ["coding", "arting"],
    title: "Game Development",
    description:
      "Create engaging digital experiences through game development. Understanding both the creative vision and the technical constraints.",
    animation: GameDevelopment,
  },
];
