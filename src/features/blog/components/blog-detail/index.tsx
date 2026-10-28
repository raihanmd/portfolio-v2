import Image from "next/image";
import Link from "next/link";

import ContentDetailNav from "~/_components/content-detail-nav";
import ContentViewTracker from "~/_components/content-view-tracker";
import RichContent from "~/_components/rich-content";
import { Card, CardContent, CardHeader } from "~/_components/ui/card";
import type { Til } from "../../../../../payload-types";
import type { BlogArticle } from "~/lib/query-blog";
import { formatBlogDate } from "~/lib/blog-date";
import BlogShareButton from "../blog-share-button";

export default function BlogDetail({ article }: { article: BlogArticle }) {
  return (
    <main className="mx-auto w-full max-w-6xl pb-24">
      <ContentViewTracker
        storageKey={`blog:view:${article.id}`}
        endpoint={`/api/blogs/${article.id}/view`}
      />
      <div className="mx-auto max-w-3xl">
        <ContentDetailNav
          backHref="/blog"
          backLabel="All articles"
          actions={<BlogShareButton title={article.title} />}
        />
      </div>

      <Card className="mx-auto w-full max-w-3xl border border-dashed border-border bg-muted/30 has-[[data-content-width=wide]]:max-w-6xl">
        {article.coverURL && (
          <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden border-x border-b border-border bg-muted">
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

        <CardHeader className="mx-auto w-full max-w-3xl p-4 pb-4 md:p-6 md:pb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
            <time dateTime={article.publishedAt.toISOString()}>
              {formatBlogDate(article.publishedAt.toISOString())}
            </time>
            {article.categoryName && <span>· {article.categoryName}</span>}
            {article.seriesName && <span>· {article.seriesName}</span>}
          </div>
          <h1 className="pt-2 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {article.title}
          </h1>
        </CardHeader>

        <CardContent className="p-0 pb-4 md:pb-6">
          <RichContent
            content={article.content as Til["content"]}
            enableHeadingAnchors
            layout="adaptive"
          />

          {article.seriesId && article.seriesName && (
            <div className="mx-auto mt-14 max-w-3xl border-t border-border px-4 pt-6 md:px-6">
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
