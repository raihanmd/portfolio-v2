import Marquee from "~/_components/ui/marquee";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import { SKILL } from "~/constant/skill";
import SkillCard from "./skill-card";

const firstRow = SKILL.slice(0, SKILL.length / 2);
const secondRow = SKILL.slice(SKILL.length / 2);

export default function Skill() {
  return (
    <Section>
      <SectionHeader title="Skills" description="What i can do" />
      <SectionContent className="[-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </Marquee>
      </SectionContent>
    </Section>
  );
}
