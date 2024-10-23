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
    title: "Website Development",
    description:
      "Create an epic, beautiful and powerful fullstack website using modern tech stacks.",
    animation: WebsiteDevelopment,
  },
  {
    badges: ["coding", "arting"],
    title: "Game Development",
    description:
      "I made a game using Unity stuff or sometime using Roblox Studio.",
    animation: GameDevelopment,
  },
];
