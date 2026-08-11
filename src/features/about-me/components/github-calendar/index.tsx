"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaGithub } from "react-icons/fa";
import Calendar from "react-github-calendar";

import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import AnimateItem from "~/_components/animate-item";

export default function GithubCalendar() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          Icon={FaGithub}
          title="Github Calendar"
          description="See my commits"
        />
        <SectionContent>
          {mounted ? (
            <Calendar
              username="raihanmd"
              blockMargin={3}
              blockSize={9.5}
              blockRadius={3}
              colorScheme={resolvedTheme as "light" | "dark"}
            />
          ) : (
            <Calendar
              username="raihanmd"
              blockMargin={3}
              blockSize={9.5}
              blockRadius={3}
              loading
            />
          )}
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
