"use client";

import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";
import Each from "~/_components/each";
import { Skeleton } from "~/_components/ui/skeleton";

interface ContentListSkeletonProps {
  count?: number;
  initialDelay?: boolean;
  variant: "article" | "note" | "series";
}

export default function ContentListSkeleton({
  count = 3,
  initialDelay = false,
  variant,
}: ContentListSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <>
      <AnimateFade
        key={`content-list-skeleton-${variant}`}
        aria-hidden
        fadeContainer={false}
        staggerChildren={0.06}
        delayChildren={initialDelay ? 0.12 : 0}
        className={variant === "note" ? "space-y-4" : undefined}
      >
        {variant === "series" && (
          <AnimateItem
            motionStyle="fade"
            className="mb-8 border-b border-border pb-7"
          >
            <Skeleton className="mb-3 h-3 w-32 motion-reduce:animate-none" />
            <Skeleton className="h-7 w-3/5 motion-reduce:animate-none" />
            <Skeleton className="mt-3 h-4 w-4/5 motion-reduce:animate-none" />
          </AnimateItem>
        )}
        <Each
          of={items}
          render={(item) =>
            variant === "note" ? (
              <AnimateItem
                key={`skeleton-${variant}-${item}`}
                className="rounded-lg border border-border/60 bg-muted/20 p-4 md:p-5"
              >
                <Skeleton className="mb-4 h-3 w-24 motion-reduce:animate-none" />
                <div className="space-y-2.5">
                  <Skeleton className="h-4 w-full motion-reduce:animate-none" />
                  <Skeleton className="h-4 w-5/6 motion-reduce:animate-none" />
                  <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
                </div>
              </AnimateItem>
            ) : (
              <AnimateItem
                key={`skeleton-${variant}-${item}`}
                className="flex gap-4 border-b border-border py-6 first:pt-0 sm:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <Skeleton className="mb-4 h-3 w-28 motion-reduce:animate-none" />
                  <Skeleton className="h-6 w-4/5 motion-reduce:animate-none" />
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-4 w-full motion-reduce:animate-none" />
                    <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
                  </div>
                </div>
                <Skeleton className="h-20 w-20 shrink-0 motion-reduce:animate-none sm:h-24 sm:w-36 md:h-28 md:w-44" />
              </AnimateItem>
            )
          }
        />
      </AnimateFade>
      <p role="status" className="sr-only">
        Loading content…
      </p>
    </>
  );
}
