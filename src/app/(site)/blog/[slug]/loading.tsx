import ContentDetailNav from "~/_components/content-detail-nav";
import ContentDetailSkeleton from "~/_components/content-detail-skeleton";
import AuroraBackground from "~/_components/ui/aurora-background";
import { Skeleton } from "~/_components/ui/skeleton";

export default function BlogDetailLoading() {
  return (
    <AuroraBackground animateBackground={false}>
      <div className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-24">
        <main
          className="mx-auto w-full max-w-6xl pb-24"
          aria-label="Loading article"
        >
          <div className="mx-auto max-w-3xl">
            <ContentDetailNav
              backHref="/blog"
              backLabel="All articles"
              actions={
                <Skeleton className="size-8 rounded-full motion-reduce:animate-none" />
              }
            />
          </div>
          <ContentDetailSkeleton variant="blog" />
        </main>
      </div>
    </AuroraBackground>
  );
}
