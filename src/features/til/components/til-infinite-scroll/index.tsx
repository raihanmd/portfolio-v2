"use client";

import { useEffect, useRef } from "react";
import { Button } from "~/_components/ui/button";

interface TilInfiniteScrollProps {
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export default function TilInfiniteScroll({
  hasNextPage,
  isLoading,
  onLoadMore,
}: TilInfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    if (typeof IntersectionObserver === "undefined") return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (!hasNextPage) return null;

  return (
    <div className="flex flex-col items-center gap-4 pt-8">
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      {isLoading ? (
        <p
          role="status"
          aria-live="polite"
          className="text-xs text-muted-foreground"
        >
          Loading more…
        </p>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadMore}
          className="min-h-11"
        >
          Load more
        </Button>
      )}
    </div>
  );
}