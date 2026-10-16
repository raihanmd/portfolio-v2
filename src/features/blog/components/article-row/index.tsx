"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import AnimateItem from "~/_components/animate-item";
import type { BlogArticle } from "~/lib/query-blog";

export default function ArticleRow({ article }: { article: BlogArticle }) {
  return (
    <AnimateItem className="border-b border-border py-6 first:pt-0">
      <article>
        <Link
          href={`/blog/${article.slug}`}
          className="group flex items-start gap-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <time
                dateTime={article.publishedAt.toISOString()}
                className="font-mono"
              >
                {article.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {article.categoryName && <span>· {article.categoryName}</span>}
              {article.seriesName && <span>· {article.seriesName}</span>}
            </div>
            <h2 className="flex items-start gap-2 text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
              {article.title}
              <ArrowUpRight
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
            </h2>
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 max-w-2xl font-['Source_Serif_4_Variable'] text-base leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            )}
          </div>
          {article.coverURL && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted sm:h-24 sm:w-36 md:h-28 md:w-44">
              <Image
                src={article.coverCardURL ?? article.coverURL}
                alt={article.coverAlt ?? ""}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 144px, 176px"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            </div>
          )}
        </Link>
      </article>
    </AnimateItem>
  );
}
