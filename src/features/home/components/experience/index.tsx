import { CountdownTimerIcon } from "@radix-ui/react-icons";

import type { TExperience } from "~/types";
import Each from "~/_components/each";
import ExperienceCard from "~/features/home/components/experience/experience-card";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import AnimateItem from "~/_components/animate-item";
import AnimateFade from "~/_components/animate-fade";

export default function Experience() {
  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          Icon={CountdownTimerIcon}
          title="Work Experiences"
          description="What & where i'm working on"
        />
        <SectionContent>
          <AnimateFade delayChildren={0.5} staggerChildren={0.2}>
            <Each
              of={EXPERENCES}
              render={(experience) => (
                <ExperienceCard experience={experience} />
              )}
            />
          </AnimateFade>
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}

//! TODO: SOON WILL REPLACED WITH API CALL
const EXPERENCES: TExperience[] = [
  {
    company: "PT Tonekan Niat Baikmu",
    href: "https://umroh.in",
    position: "Fullstack Web Developer",
    date_start: "Nov 2024",
    date_end: "Present",
  },
  {
    company: "Remote Freelancer",
    position: "Fullstack Web Developer",
    date_start: "Aug 2024",
    date_end: "Present",
  },
  {
    company: "Bumi Pakarangan Ciamis",
    position: "Fullstack Web Developer",
    date_start: "Oct 2023",
    date_end: "Dec 2023",
  },
];
