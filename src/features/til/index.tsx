"use client";

import { LightningBoltIcon } from "@radix-ui/react-icons";
import AnimateItem from "~/_components/animate-item";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import TilFeed from "./components/til-feed";

export default function TilFeature() {
  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          Icon={LightningBoltIcon}
          title="Today I Learned"
          description="Short notes on things I pick up while building"
        />
        <SectionContent className="pt-4">
          <TilFeed />
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
