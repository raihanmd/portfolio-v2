import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import { Skeleton } from "~/_components/ui/skeleton";

interface ContentDetailSkeletonProps {
  variant: "blog" | "til";
}

export default function ContentDetailSkeleton({
  variant,
}: ContentDetailSkeletonProps) {
  return (
    <Card
      aria-label={variant === "blog" ? "Loading article" : "Loading TIL"}
      className="-mx-0 overflow-hidden border border-dashed border-border bg-muted/30"
    >
      {variant === "blog" && (
        <Skeleton className="aspect-video w-full rounded-none motion-reduce:animate-none" />
      )}
      <CardHeader className="p-4 pb-3 md:p-6 md:pb-3">
        <Skeleton className="h-3 w-40 motion-reduce:animate-none" />
        {variant === "blog" && (
          <Skeleton className="mt-3 h-9 w-4/5 motion-reduce:animate-none" />
        )}
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 md:p-6 md:pt-0">
        <Skeleton className="h-5 w-full motion-reduce:animate-none" />
        <Skeleton className="h-5 w-full motion-reduce:animate-none" />
        <Skeleton className="h-5 w-2/3 motion-reduce:animate-none" />
      </CardContent>
    </Card>
  );
}
