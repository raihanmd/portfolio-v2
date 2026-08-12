"use client";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/til"
          className="group inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All TILs
        </Link>
        <TilShareButton title={`TIL · ${formatTilDate(til.date)}`} />
      </div>
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
    </div>
  );
}
