import Image from "next/image";
import Link from "next/link";

import ContentDetailNav from "~/_components/content-detail-nav";
import RichContent from "~/_components/rich-content";
import ShareButton from "~/_components/share-button";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import type { Til } from "../../../../../payload-types";
import type { BlogArticle } from "~/lib/query-blog";
import BlogViewTracker from "../blog-view-tracker";

export default function BlogDetail({ article }: { article: BlogArticle }) {
  return (
    <main className="mx-auto w-full max-w-3xl pb-24">
      <BlogViewTracker id={article.id} />
      <ContentDetailNav
        backHref="/blog"
        backLabel="All articles"
        actions={
          <ShareButton title={article.title} ariaLabel="Share this article" />
        }
      />

      <Card className="-mx-0 overflow-hidden border border-dashed border-border bg-muted/30">
        {article.coverURL && (
          <div className="relative aspect-video overflow-hidden border-b border-border bg-muted">
            <Image
              src={article.coverURL}
              alt={article.coverAlt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        )}

        <CardHeader className="p-4 pb-4 md:p-6 md:pb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
            <time dateTime={article.publishedAt.toISOString()}>
              {article.publishedAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {article.categoryName && <span>· {article.categoryName}</span>}
            {article.seriesName && <span>· {article.seriesName}</span>}
          </div>
          <h1 className="pt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {article.title}
          </h1>
        </CardHeader>

        <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
          <RichContent content={article.content as Til["content"]} />

          {article.seriesId && article.seriesName && (
            <div className="mt-14 border-t border-border pt-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Part of a series
              </p>
              <Link
                href={`/blog?view=series#series-${article.seriesId}`}
                className="rounded-md text-sm font-medium underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {article.seriesName}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
