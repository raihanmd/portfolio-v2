import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import type { ReactNode } from "react";

interface ContentDetailNavProps {
  backHref: string;
  backLabel: string;
  actions?: ReactNode;
}

export default function ContentDetailNav({
  backHref,
  backLabel,
  actions,
}: ContentDetailNavProps) {
  return (
    <div className="mb-4 flex min-h-8 items-center justify-between">
      <Link
        href={backHref}
        className="group inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" />
        {backLabel}
      </Link>
      {actions}
    </div>
  );
}
