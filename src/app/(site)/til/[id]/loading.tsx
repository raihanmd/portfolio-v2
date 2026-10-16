import ContentDetailNav from "~/_components/content-detail-nav";
import ContentDetailSkeleton from "~/_components/content-detail-skeleton";
import AuroraBackground from "~/_components/ui/aurora-background";
import { Skeleton } from "~/_components/ui/skeleton";

export default function TilDetailLoading() {
  return (
    <AuroraBackground>
      <div className="container mx-auto min-h-screen px-6 pt-24 lg:px-0">
        <main
          className="mx-auto w-full max-w-3xl pb-24"
          aria-label="Loading TIL"
        >
          <ContentDetailNav
            backHref="/til"
            backLabel="All TILs"
            actions={
              <Skeleton className="size-8 rounded-full motion-reduce:animate-none" />
            }
          />
          <ContentDetailSkeleton variant="til" />
        </main>
      </div>
    </AuroraBackground>
  );
}
