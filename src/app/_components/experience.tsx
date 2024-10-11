import { TExperience } from "~/types";
import ExperienceCard from "./experience-card";

export default function Experience() {
  return (
    <div className="relative z-[5] space-y-4 py-5">
      <h1 className="flex flex-col text-lg font-semibold sm:flex-row sm:gap-2">
        Work Experiences 💻
      </h1>
      <div className="space-y-4">
        {EXPERENCES.map((experience) => (
          <ExperienceCard key={experience.company} experience={experience} />
        ))}
      </div>
    </div>
  );
}

const EXPERENCES: TExperience[] = [
  {
    company: "Bumi Pakarangan Ciamis",
    position: "Fullstack Web Developer",
    date_start: "Oct 2023",
    date_end: "Dec 2023",
  },
];
