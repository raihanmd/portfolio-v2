"use client";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import AnimateItem from "~/_components/animate-item";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import { formatTilDate } from "~/lib/til-date";
import type { Til } from "../../../../../payload-types";
import TilRichText from "../til-content";

interface TilRowProps {
  til: Til;
}

export default function TilRow({ til }: TilRowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const update = () => {
      setHasOverflow(element.scrollHeight > element.clientHeight + 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    // Webfont swap changes text height; re-measure once fonts are ready so
    // the "Read more" hint doesn't pop in after the entrance animation.
    if (typeof document.fonts !== "undefined") {
      void document.fonts.ready.then(update);
    }
    return () => observer.disconnect();
  }, []);

  const dateLabel = formatTilDate(til.date);

  return (
    <AnimateItem>
      <Card className="group -mx-0 relative overflow-hidden border border-dashed border-border bg-muted/30 transition-all group-hover:border-foreground/25 group-hover:shadow-lg">
        {/* Overlay link keeps native anchor semantics while avoiding
            interactive content (copy button) nested inside an <a>. */}
        <Link
          href={`/til/${til.id}`}
          aria-label={`Read TIL from ${dateLabel}`}
          className="absolute inset-0 z-10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <CardHeader className="p-4 pb-2 md:p-5 md:pb-2">
          <time
            dateTime={til.date}
            className="font-mono text-xs uppercase leading-4 tracking-wider text-muted-foreground"
          >
            {dateLabel}
          </time>
        </CardHeader>
        <CardContent className="relative p-4 pt-0 md:p-5 md:pt-0">
          <div
            ref={contentRef}
            className="max-h-[280px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          >
            <TilRichText til={til} />
          </div>
          {hasOverflow && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
              <span className="animate-in fade-in-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground transition-all duration-500 group-hover:border-foreground/30 group-hover:text-foreground">
                Read more
                <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimateItem>
  );
}
