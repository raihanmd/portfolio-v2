import Link from "next/link";

import AnimateFade from "~/_components/animate-fade";
import AuroraBackground from "~/_components/ui/aurora-background";
import { Button } from "~/_components/ui/button";

export default function TilNotFound() {
  return (
    <AuroraBackground>
      <AnimateFade className="container mx-auto flex h-full flex-col items-center justify-center px-6 pt-24 text-center lg:px-0">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          404 · Not Found
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          TIL not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          This TIL doesn&apos;t exist, or it&apos;s still a draft waiting to be
          published.
        </p>
        <Button asChild className="mt-8">
          <Link href="/til">Back to all TILs</Link>
        </Button>
      </AnimateFade>
    </AuroraBackground>
  );
}
