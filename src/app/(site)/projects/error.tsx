"use client";

import { Button } from "~/_components/ui/button";

export default function ProjectsError({ reset }: { reset: () => void }) {
  return (
    <div className="container mx-auto px-6 pt-24 lg:px-0">
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-foreground">Projects could not be loaded.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again in a moment.
        </p>
        <Button className="mt-4" variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
