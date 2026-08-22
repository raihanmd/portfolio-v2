import { CountdownTimerIcon } from "@radix-ui/react-icons";
import { getPayload } from "payload";

import Each from "~/_components/each";
import ExperienceCard from "~/features/home/components/experience/experience-card";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import AnimateItem from "~/_components/animate-item";
import AnimateFade from "~/_components/animate-fade";
import config from "../../../../../payload.config";

export default async function Experience() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "experiences",
    depth: 0,
  });

  // Current roles first, then by start date descending
  docs.sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
    return new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime();
  });

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
              of={docs}
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
