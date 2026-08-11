import { Skeleton } from "~/_components/ui/skeleton";

interface TilSkeletonProps {
  count?: number;
}

export default function TilSkeleton({ count = 5 }: TilSkeletonProps) {
  return (
    <>
      <div aria-hidden className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="rounded-lg border border-dashed border-border/40 bg-muted p-4 md:p-5"
          >
            <Skeleton className="mb-3 h-3 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <p role="status" className="sr-only">
        Loading TILs…
      </p>
    </>
  );
}