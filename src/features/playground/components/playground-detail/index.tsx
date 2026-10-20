import type { Til } from "../../../../../payload-types";
import ContentDetailNav from "~/_components/content-detail-nav";
import RichContent from "~/_components/rich-content";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import type { PlaygroundEntry } from "~/lib/query-playground";

export default function PlaygroundDetail({
  playground,
}: {
  playground: PlaygroundEntry;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl pb-24">
      <div className="mx-auto max-w-3xl">
        <ContentDetailNav backHref="/playground" backLabel="All playgrounds" />
      </div>

      <Card className="-mx-0 border border-dashed border-border bg-muted/30">
        <CardHeader className="mx-auto w-full max-w-3xl p-4 pb-4 md:p-6 md:pb-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Interactive Playground
          </p>
          <h1 className="pt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {playground.name}
          </h1>
          <p className="pt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            {playground.description}
          </p>
        </CardHeader>
        <CardContent className="p-0 pb-4 md:pb-6">
          <RichContent
            content={playground.content as Til["content"]}
            enableHeadingAnchors
            layout="adaptive"
          />
        </CardContent>
      </Card>
    </main>
  );
}
