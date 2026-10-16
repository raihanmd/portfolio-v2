"use client";

import Link from "next/link";

import { Button } from "~/_components/ui/button";
import AuroraBackground from "~/_components/ui/aurora-background";

export default function TilError({ reset }: { reset: () => void }) {
  return (
    <AuroraBackground>
      <main className="container mx-auto flex min-h-screen flex-col justify-center px-6 py-24 lg:px-0">
        <h1 className="text-3xl font-semibold tracking-tight">
          Unable to load the TIL feed
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Today&apos;s learnings are temporarily unavailable. Please try again.
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>Retry</Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </main>
    </AuroraBackground>
  );
}
