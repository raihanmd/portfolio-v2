"use client";

import { ArrowUpRight, Shapes } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";
import ContentEmptyState from "~/_components/content-empty-state";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import type { PlaygroundSummary } from "~/lib/query-playground";

export default function PlaygroundFeature({
  children,
}: {
  children: ReactNode;
}) {
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
            {children}
          </SectionContent>
        </AnimateFade>
      </Section>
    </main>
  );
}

export function PlaygroundResults({
  playgrounds,
}: {
  playgrounds: PlaygroundSummary[];
}) {
  if (playgrounds.length === 0) {
    return (
      <AnimateItem>
        <ContentEmptyState
          title="No playgrounds published yet"
          description="Interactive tools will appear here after they are published."
        />
      </AnimateItem>
    );
  }

  return (
    <AnimateFade
      fadeContainer={false}
      skipInitialAnimation
      staggerChildren={0.06}
      className="space-y-4"
    >
      {playgrounds.map((playground) => (
        <AnimateItem key={playground.id}>
          <Card className="group relative -mx-0 overflow-hidden border border-dashed border-border bg-muted/30 transition-all group-hover:border-foreground/25 group-hover:shadow-lg">
            <Link
              href={`/playground/${playground.slug}`}
              aria-label={`Open ${playground.name}`}
              className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <CardHeader className="p-4 pb-2 md:p-5 md:pb-2">
              <h2 className="flex items-start gap-2 text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                {playground.name}
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground motion-reduce:transition-none"
                />
              </h2>
            </CardHeader>
            <CardContent className="relative p-4 pt-0 md:p-5 md:pt-0">
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {playground.description}
              </p>
            </CardContent>
          </Card>
        </AnimateItem>
      ))}
    </AnimateFade>
  );
}
