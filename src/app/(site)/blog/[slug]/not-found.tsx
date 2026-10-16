import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import AuroraBackground from "~/_components/ui/aurora-background";

export default function BlogNotFound() {
  return (
    <AuroraBackground>
      <main className="container mx-auto flex min-h-screen flex-col justify-center px-6 py-24 lg:px-0">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          404 · Blog
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Article not found
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          This article may be unpublished or the link may have changed.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm font-medium underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to blog
        </Link>
      </main>
    </AuroraBackground>
  );
}
