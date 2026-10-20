import ContentDetailNav from "~/_components/content-detail-nav";
import AuroraBackground from "~/_components/ui/aurora-background";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import { Skeleton } from "~/_components/ui/skeleton";

export default function PlaygroundDetailLoading() {
  return (
    <AuroraBackground animateBackground={false}>
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-24">
        <main
          aria-label="Loading playground"
          className="mx-auto w-full max-w-6xl pb-24"
        >
          <div className="mx-auto max-w-3xl">
            <ContentDetailNav
              backHref="/playground"
              backLabel="All playgrounds"
            />
          </div>
          <Card className="-mx-0 border border-dashed border-border bg-muted/30">
            <CardHeader className="mx-auto w-full max-w-3xl p-4 pb-4 md:p-6 md:pb-4">
              <Skeleton className="h-3 w-40 motion-reduce:animate-none" />
              <Skeleton className="mt-3 h-9 w-4/5 motion-reduce:animate-none" />
              <Skeleton className="mt-3 h-4 w-full motion-reduce:animate-none" />
            </CardHeader>
            <CardContent className="mx-auto w-full max-w-3xl space-y-3 p-4 pt-0 md:p-6 md:pt-0">
              <Skeleton className="h-5 w-full motion-reduce:animate-none" />
              <Skeleton className="h-5 w-full motion-reduce:animate-none" />
              <Skeleton className="h-5 w-2/3 motion-reduce:animate-none" />
            </CardContent>
          </Card>
        </main>
      </div>
    </AuroraBackground>
  );
}
