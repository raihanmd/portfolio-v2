"use client";

import { BookOpen, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import AnimateFade from "~/_components/animate-fade";
import AnimateItem from "~/_components/animate-item";
import ContentEmptyState from "~/_components/content-empty-state";
import ContentResultsTransition from "~/_components/content-results-transition";
import { Button } from "~/_components/ui/button";
import { Input } from "~/_components/ui/input";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import type {
  BlogArticle,
  BlogCategoryOption,
  BlogSeriesOption,
  BlogSeriesSection,
} from "~/lib/query-blog";
import { formatBlogDate } from "~/lib/blog-date";
import ArticleRow from "./components/article-row";
import BlogViewTabs from "./components/blog-view-tabs";

type BlogView = "articles" | "series";

interface BlogFeatureProps {
  view: BlogView;
  resultsKey: string;
  search: string;
  category?: number;
  series?: number;
  categories: BlogCategoryOption[];
  directory: BlogSeriesOption[];
  children: ReactNode;
}

function blogURL(values: {
  view?: BlogView;
  search?: string;
  category?: number;
  series?: number;
  cursor?: string;
}): string {
  const params = new URLSearchParams();
  if (values.view === "series") params.set("view", "series");
  if (values.search) params.set("search", values.search);
  if (values.category) params.set("category", String(values.category));
  if (values.series) params.set("series", String(values.series));
  if (values.cursor) params.set("cursor", values.cursor);
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export default function BlogFeature({
  view,
  resultsKey,
  search,
  category,
  series,
  categories,
  directory,
  children,
}: BlogFeatureProps) {
  // Clear action shares the tabs row (justify-between) and is only visible
  // while a filter is applied: articles reacts to search/category/series,
  // series reacts to search.
  const showClear =
    view === "series"
      ? Boolean(search)
      : Boolean(search) || category !== undefined || series !== undefined;
  const clearHref = view === "series" ? "/blog?view=series" : "/blog";
  const clearLabel = view === "series" ? "Clear search" : "Clear filters";
  return (
    <main className="w-full pb-24">
      <Section>
        <AnimateFade staggerChildren={0.3}>
          <div className="mx-auto max-w-[672px]">
            <AnimateItem>
              <SectionHeader
                Icon={BookOpen}
                title="Blog"
                description="Notes, essays, and longer journeys through things I build and learn."
              />
            </AnimateItem>
          </div>

          <SectionContent className="space-y-0 pt-2">
            <AnimateFade fadeContainer={false} staggerChildren={0.08}>
              <div className="flex items-center justify-between gap-3">
                <AnimateItem className="min-w-0 flex-1">
                  <BlogViewTabs
                    key={view}
                    view={view}
                    articlesHref={blogURL({
                      search: view === "articles" ? search : undefined,
                    })}
                    seriesHref={blogURL({
                      view: "series",
                      search: view === "series" ? search : undefined,
                    })}
                  />
                </AnimateItem>
                {showClear && (
                  <AnimateItem className="shrink-0">
                    <Link
                      href={clearHref}
                      className="mb-4 whitespace-nowrap text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {clearLabel}
                    </Link>
                  </AnimateItem>
                )}
              </div>

              {view === "articles" ? (
                <>
                  <AnimateItem>
                    <form
                      action="/blog"
                      method="get"
                      className="mx-auto grid w-full max-w-[672px] grid-cols-2 gap-3 pb-10 md:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]"
                    >
                    <label className="relative col-span-2 block min-w-0 md:col-span-1">
                      <span className="sr-only">Search article titles</span>
                      <Search
                        className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        type="search"
                        name="search"
                        defaultValue={search}
                        placeholder="Search titles"
                        maxLength={100}
                        className="h-11 pl-9 focus-visible:ring-2 focus-visible:ring-offset-2"
                      />
                    </label>
                    <Select
                      name="category"
                      defaultValue={
                        category === undefined ? "all" : String(category)
                      }
                    >
                      <SelectTrigger
                        aria-label="Category"
                        className="h-11 min-w-0 focus-visible:ring-2 focus-visible:ring-offset-2"
                      >
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      name="series"
                      defaultValue={
                        series === undefined ? "all" : String(series)
                      }
                    >
                      <SelectTrigger
                        aria-label="Series"
                        className="h-11 min-w-0 focus-visible:ring-2 focus-visible:ring-offset-2"
                      >
                        <SelectValue placeholder="All series" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All series</SelectItem>
                        {directory.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="submit"
                      variant="outline"
                      className="col-span-2 min-h-11 bg-transparent hover:bg-muted md:col-span-1"
                    >
                      Apply
                    </Button>
                    </form>
                  </AnimateItem>
                </>
              ) : (
                <>
                  <AnimateItem>
                    <form
                      action="/blog"
                      method="get"
                      className="mx-auto flex w-full max-w-[672px] gap-3 pb-10"
                    >
                    <input type="hidden" name="view" value="series" />
                    <label className="relative min-w-0 flex-1">
                      <span className="sr-only">
                        Search series or article titles
                      </span>
                      <Search
                        className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Input
                        type="search"
                        name="search"
                        defaultValue={search}
                        placeholder="Search series and titles"
                        maxLength={100}
                        className="h-11 pl-9 focus-visible:ring-2 focus-visible:ring-offset-2"
                      />
                    </label>
                    <Button
                      type="submit"
                      variant="outline"
                      className="min-h-11 bg-transparent hover:bg-muted"
                    >
                      Search
                    </Button>
                    </form>
                  </AnimateItem>
                </>
              )}
            </AnimateFade>
          </SectionContent>
        </AnimateFade>
        <ContentResultsTransition transitionKey={resultsKey}>
            {view === "articles" ? (
              <div className="mx-auto max-w-[672px]">{children}</div>
            ) : directory.length === 0 ? (
              <ContentEmptyState
                title={
                  search
                    ? "No series or article titles match that search."
                    : "No published series yet."
                }
              />
            ) : (
              <div className="mx-auto grid max-w-[672px] gap-8 xl:mx-0 xl:max-w-[888px] xl:grid-cols-[12rem_minmax(0,1fr)] xl:gap-6">
                <div className="min-w-0 xl:sticky xl:top-24 xl:self-start">
                  <AnimateFade
                    key={`series-directory-${search}-${directory.map((item) => item.id).join("-")}`}
                    fadeContainer={false}
                    staggerChildren={0.06}
                    deferUntilMounted
                  >
                    <aside aria-label="Series directory" className="space-y-1">
                      <AnimateItem
                        motionStyle="fade"
                        className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground"
                      >
                        Series
                      </AnimateItem>
                      {directory.map((item, index) => (
                        <AnimateItem motionStyle="fade" key={item.id}>
                          <Link
                            href={`${blogURL({ view: "series", search })}#series-${item.id}`}
                            className="block rounded-md px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="block">{item.name}</span>
                            <span className="mt-1 block font-mono text-xs text-muted-foreground">
                              {index === 0 && !search ? "Newest · " : ""}
                              {item.articleCount}{" "}
                              {item.articleCount === 1 ? "article" : "articles"}
                            </span>
                          </Link>
                          {search && item.matchingArticles.length > 0 && (
                            <ul className="mb-2 space-y-1 pl-5">
                              {item.matchingArticles.map((match) => (
                                <li key={match.slug}>
                                  <Link
                                    href={`/blog/${match.slug}`}
                                    className="block rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                  >
                                    {match.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </AnimateItem>
                      ))}
                    </aside>
                  </AnimateFade>
                </div>
                <div className="min-w-0 space-y-16">{children}</div>
              </div>
            )}
          </ContentResultsTransition>
      </Section>
    </main>
  );
}

export function BlogArticleResults({
  articles,
  nextCursor,
  search,
  category,
  series,
}: {
  articles: BlogArticle[];
  nextCursor: string | null;
  search: string;
  category?: number;
  series?: number;
}) {
  const animationKey = [
    "articles",
    search,
    category ?? "all",
    series ?? "all",
    ...articles.map((article) => article.id),
  ].join(":");

  return (
    <>
      <ArticleList articles={articles} animationKey={animationKey} />
      {nextCursor && (
        <MoreLink
          href={blogURL({ search, category, series, cursor: nextCursor })}
        />
      )}
    </>
  );
}

export function BlogSeriesResults({
  sections,
  search,
}: {
  sections: BlogSeriesSection[];
  search: string;
}) {
  return (
    <AnimateFade
      key={`series-sections-${search}`}
      fadeContainer={false}
      staggerChildren={0.06}
      deferUntilMounted
    >
      {sections.map((item) => (
        <section
          key={item.id}
          id={`series-${item.id}`}
          aria-label={item.name}
          className="min-w-0 scroll-mt-24"
        >
          <AnimateItem
            motionStyle="fade"
            className="mb-8 border-b border-border pb-7"
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Started{" "}
              {formatBlogDate(item.firstPublishedAt.toISOString(), "monthYear")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {item.name}
            </h2>
            {item.description && (
              <p className="mt-3 max-w-2xl font-['Source_Serif_4_Variable'] text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
          </AnimateItem>
          <ArticleList
            articles={item.articles}
            animationKey={`series-articles-${search}-${item.id}`}
            initialDelay
          />
        </section>
      ))}
    </AnimateFade>
  );
}

function ArticleList({
  articles,
  animationKey,
  initialDelay = false,
}: {
  articles: BlogArticle[];
  animationKey: string;
  initialDelay?: boolean;
}) {
  return articles.length > 0 ? (
    <AnimateFade
      key={animationKey}
      fadeContainer={false}
      staggerChildren={0.06}
      delayChildren={initialDelay ? 0.12 : 0}
      deferUntilMounted
    >
      {articles.map((article) => (
        <ArticleRow key={`${animationKey}-${article.id}`} article={article} />
      ))}
    </AnimateFade>
  ) : (
    <ContentEmptyState
      title="No published articles match these filters."
      action={
        <Link
          href="/blog"
          className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Clear filters
        </Link>
      }
    />
  );
}

function MoreLink({ href }: { href: string }) {
  return (
    <div className="pt-8">
      <Button asChild variant="outline" className="min-h-11">
        <Link href={href}>Next 10 articles</Link>
      </Button>
    </div>
  );
}
