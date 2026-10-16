"use client";

import ContentDetailNav from "~/_components/content-detail-nav";
import ContentViewTracker from "~/_components/content-view-tracker";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import { formatTilDate } from "~/lib/til-date";
import type { Til } from "../../../../../payload-types";
import TilRichText from "../til-content";
import TilShareButton from "../til-share-button";

interface TilDetailProps {
  til: Til;
}

export default function TilDetail({ til }: TilDetailProps) {
  return (
    <main className="mx-auto max-w-3xl pb-24">
      <ContentViewTracker
        storageKey={`til:view:${til.id}`}
        endpoint={`/api/tils/${til.id}/view`}
      />
      <ContentDetailNav
        backHref="/til"
        backLabel="All TILs"
        actions={<TilShareButton title={`TIL · ${formatTilDate(til.date)}`} />}
      />
      <Card className="-mx-0 overflow-hidden border border-dashed border-border bg-muted/30">
        <CardHeader className="p-4 pb-2 md:p-6 md:pb-2">
          <time
            dateTime={til.date}
            className="font-mono text-xs uppercase leading-4 tracking-wider text-muted-foreground"
          >
            {formatTilDate(til.date)}
          </time>
        </CardHeader>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <TilRichText til={til} />
        </CardContent>
      </Card>
    </main>
  );
}
