"use client";

import Link, { useLinkStatus } from "next/link";
import { useState } from "react";

import { cn } from "~/lib/cn";

type BlogView = "articles" | "series";

interface BlogViewTabsProps {
  view: BlogView;
  articlesHref: string;
  seriesHref: string;
}

function TabStatus() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-1 rounded-full bg-current opacity-0 transition-opacity",
        pending && "animate-pulse opacity-60 motion-reduce:animate-none",
      )}
    />
  );
}

export default function BlogViewTabs({
  view,
  articlesHref,
  seriesHref,
}: BlogViewTabsProps) {
  const [optimisticView, setOptimisticView] = useState(view);

  const tabs = [
    { label: "Articles", value: "articles", href: articlesHref },
    { label: "Series", value: "series", href: seriesHref },
  ] as const;

  return (
    <nav
      aria-label="Blog views"
      className="mx-auto mb-4 flex max-w-[672px] gap-6 border-b border-border"
    >
      {tabs.map((tab) => {
        const active = optimisticView === tab.value;

        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            onNavigate={() => setOptimisticView(tab.value)}
            className={cn(
              "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            <TabStatus />
          </Link>
        );
      })}
    </nav>
  );
}
