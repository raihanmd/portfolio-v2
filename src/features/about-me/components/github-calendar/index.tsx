"use client";

import { useTheme } from "next-themes";
import { FaGithub } from "react-icons/fa";
import Calendar from "react-github-calendar";

import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";

export default function GithubCalendar() {
  const { resolvedTheme } = useTheme();

  return (
    <Section>
      <SectionHeader
        Icon={FaGithub}
        title="Github Calendar"
        description="See my commits"
      />
      <SectionContent>
        <Calendar
          username="raihanmd"
          blockMargin={3}
          blockSize={9.5}
          blockRadius={3}
          colorScheme={resolvedTheme as "light" | "dark"}
        />
      </SectionContent>
    </Section>
  );
}
