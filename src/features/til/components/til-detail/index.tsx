"use client";

import { useEffect } from "react";

import ContentDetailNav from "~/_components/content-detail-nav";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import { formatTilDate } from "~/lib/til-date";
import type { Til } from "../../../../../payload-types";
import TilRichText from "../til-content";
import TilShareButton from "../til-share-button";

interface TilDetailProps {
  til: Til;
}

/**
 * Counts a page view once per TIL per browser session: sessionStorage guards
 * refreshes/spam, a debounce skips quick bounces, and the POST is fire-and-
 * forget so tracking never blocks rendering. Fires only from the standalone
 * page (TilDetail is not used by the modal), keeping the number a real
 * page-view metric rather than counting every modal open in the feed.
 */
function useTilViewTracker(tilId: string) {
  useEffect(() => {
    const storageKey = `til:view:${tilId}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Storage unavailable (private mode, blocked cookies) — count this mount.
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch(`/api/tils/${tilId}/view`, {
        method: "POST",
        signal: controller.signal,
      }).catch(() => {
        // Tracking is best-effort; ignore failures.
      });
    }, 1500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [tilId]);
}

export default function TilDetail({ til }: TilDetailProps) {
  useTilViewTracker(til.id);

  return (
    <main className="mx-auto max-w-3xl pb-24">
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
