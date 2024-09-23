export const TIMELINE = [
  {
    id: 1,
    title: "Freelancer",
    date: "8-2024 - Present",
  },
  {
    id: 2,
    title: "Fullstack Developer - Bumi Pakarangan Ciamis",
    date: "10-2023 - 12-2023",
  },
];

export type TimelineData = (typeof TIMELINE)[number];

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
  description?: string;
}
