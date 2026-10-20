"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import AnimateItem from "~/_components/animate-item";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";

export interface PlaygroundSummary {
  id: number;
  name: string;
  slug: string;
  description: string;
  publishedAt: string;
}

export default function PlaygroundRow({
  playground,
}: {
  playground: PlaygroundSummary;
}) {
  return (
    <AnimateItem>
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
  );
}
