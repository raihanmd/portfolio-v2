import type { IconType } from "react-icons";
import type { ClassValue } from "clsx";
import {
  RiNextjsFill,
  RiJavascriptFill,
  RiTailwindCssFill,
  RiSupabaseFill,
} from "react-icons/ri";
import { BiLogoTypescript } from "react-icons/bi";
import {
  SiFramer,
  SiShadcnui,
  SiSwagger,
  SiNestjs,
  SiRobloxstudio,
  SiClerk,
  SiLua,
} from "react-icons/si";
import { FaNodeJs, FaReact } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { SiBun, SiPrisma } from "react-icons/si";

export type TSkill = {
  icon: IconType;
  color: ClassValue;
  name: string;
};

export const SKILL: TSkill[] = [
  {
    icon: RiNextjsFill,
    color: "fill-primary",
    name: "Next.js",
  },
  {
    icon: SiLua,
    color: "fill-blue-800",
    name: "Lua",
  },
  {
    icon: RiSupabaseFill,
    color: "fill-green-700",
    name: "Supabase",
  },
  {
    icon: SiRobloxstudio,
    color: "fill-blue-500",
    name: "Roblox Studio",
  },
  {
    icon: FaReact,
    color: "fill-blue-500",
    name: "React.js",
  },
  {
    icon: SiBun,
    color: "fill-rose-200",
    name: "Bun",
  },
  {
    icon: SiPrisma,
    color: "fill-primary",
    name: "Prisma",
  },
  {
    icon: SiNestjs,
    color: "fill-red-600",
    name: "Nest.js",
  },
  {
    icon: SiClerk,
    color: "fill-blue-600",
    name: "Clerk",
  },
  {
    icon: SiSwagger,
    color: "text-green-600",
    name: "Swagger",
  },
  {
    icon: SiShadcnui,
    color: "fill-primary",
    name: "Shadcn UI",
  },
  {
    icon: RiTailwindCssFill,
    color: "fill-blue-400",
    name: "TailwindCSS",
  },
  {
    icon: RiJavascriptFill,
    color: "fill-yellow-400",
    name: "Javascript",
  },
  {
    icon: BiLogoTypescript,
    color: "fill-blue-500",
    name: "Typescript",
  },
  {
    icon: SiFramer,
    color: "fill-primary",
    name: "Framer Motion",
  },
  {
    icon: FaNodeJs,
    color: "text-green-600",
    name: "Node.js",
  },
  {
    icon: FaGolang,
    color: "fill-blue-400",
    name: "Go-lang",
  },
];
