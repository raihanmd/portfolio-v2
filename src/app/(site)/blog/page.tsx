import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/archivo";

import type { Metadata } from "next";
import { Suspense } from "react";

import ContentListSkeleton from "~/_components/content-list-skeleton";
import AnimateFade from "~/_components/animate-fade";
import AuroraBackground from "~/_components/ui/aurora-background";
import { PAGE_SEO, SITE_CONFIG } from "~/constant/seo";
import BlogFeature, {
  BlogArticleResults,
  BlogSeriesResults,
} from "~/features/blog";
import {
  getBlogCategories,
  getBlogList,
  getBlogSeries,
  getBlogSeriesSections,
} from "~/lib/query-blog";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  alternates: { canonical: `${SITE_CONFIG.url}/blog` },
  openGraph: {
    title: PAGE_SEO.blog.title,
    description: PAGE_SEO.blog.description,
    url: `${SITE_CONFIG.url}/blog`,
  },
  twitter: {
    title: PAGE_SEO.blog.title,
    description: PAGE_SEO.blog.description,
  },
};

interface BlogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : (value?.[0] ?? "");
}

function positiveInteger(value: string): number | undefined {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}

async function ArticleResults({
  search,
  category,
  series,
  cursor,
}: {
  search: string;
  category?: number;
  series?: number;
  cursor: string;
}) {
  const list = await getBlogList({ search, category, series, cursor });
  return (
    <BlogArticleResults
      articles={list.articles}
      nextCursor={list.nextCursor}
      search={search}
      category={category}
      series={series}
    />
  );
}

async function SeriesResults({
  directory,
  search,
}: {
  directory: Awaited<ReturnType<typeof getBlogSeries>>;
  search: string;
}) {
  const sections = await getBlogSeriesSections(directory, search);
  return <BlogSeriesResults sections={sections} search={search} />;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const view = first(params.view) === "series" ? "series" : "articles";
  const search = first(params.search).trim().slice(0, 100);
  const category = positiveInteger(first(params.category));
  const series = positiveInteger(first(params.series));
  const cursor = first(params.cursor);

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
  ]);

  const [categories, directory] = await Promise.all([
    getBlogCategories(),
    getBlogSeries(view === "series" ? search : ""),
  ]);
  const resultsKey = [view, search, category, series, cursor].join(":");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <AuroraBackground
        animateBackground={false}
        className="h-auto min-h-screen"
      >
        <AnimateFade
          staggerChildren={0.3}
          className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-16"
        >
          <BlogFeature
            view={view}
            resultsKey={resultsKey}
            search={search}
            category={category}
            series={series}
            categories={categories}
            directory={directory}
          >
            <Suspense
              fallback={
                <ContentListSkeleton
                  count={3}
                  initialDelay
                  variant={view === "articles" ? "article" : "series"}
                />
              }
            >
              {view === "articles" ? (
                <ArticleResults
                  search={search}
                  category={category}
                  series={series}
                  cursor={cursor}
                />
              ) : (
                <SeriesResults directory={directory} search={search} />
              )}
            </Suspense>
          </BlogFeature>
        </AnimateFade>
      </AuroraBackground>
    </>
  );
}
