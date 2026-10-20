"use client";

import { Shapes } from "lucide-react";

import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import PlaygroundFeed from "./components/playground-feed";

export default function PlaygroundFeature() {
  return (
    <main className="w-full pb-24">
      <Section>
        <AnimateFade staggerChildren={0.3} className="space-y-4">
          <div className="mx-auto max-w-[672px]">
            <AnimateItem>
              <SectionHeader
                Icon={Shapes}
                title="Playground"
                description="Interactive tools that run in your browser."
              />
            </AnimateItem>
          </div>
          <SectionContent className="mx-auto w-full max-w-[672px] pt-4">
            <PlaygroundFeed />
          </SectionContent>
        </AnimateFade>
      </Section>
    </main>
  );
}
