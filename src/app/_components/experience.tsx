import type { TExperience } from "~/types";
import ExperienceCard from "./experience-card";
import { Section, SectionContent, SectionHeader } from "./ui/section";
import { CountdownTimerIcon } from "@radix-ui/react-icons";
import Each from "./each";

export default function Experience() {
  return (
    <Section>
      <SectionHeader
        Icon={CountdownTimerIcon}
        title="Work Experiences"
        description="What & where i'm working on"
      />
      <SectionContent>
        <Each
          of={EXPERENCES}
          render={(experience) => <ExperienceCard experience={experience} />}
        />
      </SectionContent>
    </Section>
  );
}

const EXPERENCES: TExperience[] = [
  {
    company: "Bootcamp Sanbercode",
    position: "Fullstack Web Developer",
    date_start: "Jul 2024",
    date_end: "Sep 2024",
  },
  {
    company: "Bumi Pakarangan Ciamis",
    position: "Fullstack Web Developer",
    date_start: "Oct 2023",
    date_end: "Dec 2023",
  },
];
