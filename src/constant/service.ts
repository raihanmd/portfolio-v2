import type { ComponentType } from "react";
import dynamic from "next/dynamic";

export type TService = {
  badges: string[];
  title: string;
  description: string;
  animation: ComponentType<{}>;
};

export const SERVICE: TService[] = [
  {
    badges: ["coding"],
    title: "Website Development",
    description:
      "Create an epic, beautiful and powerful fullstack website using modern tech stacks.",
    animation: dynamic(
      () => import("~/app/_components/service/website-development"),
      {
        ssr: false,
      },
    ),
  },
  {
    badges: ["coding", "arting"],
    title: "Game Development",
    description:
      "I made a game using Unity stuff or sometime using Roblox Studio.",
    animation: dynamic(
      () => import("~/app/_components/service/game-development"),
      {
        ssr: false,
      },
    ),
  },
];
