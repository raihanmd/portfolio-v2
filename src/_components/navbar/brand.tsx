"use client";

import Link from "next/link";

import { cn } from "~/lib/cn";

export default function NavbarBrand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Raihanmd, home"
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      Raihanmd
    </Link>
  );
}
