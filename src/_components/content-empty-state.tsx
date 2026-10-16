import type { ReactNode } from "react";

import { cn } from "~/lib/cn";

interface ContentEmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function ContentEmptyState({
  title,
  description,
  action,
  className,
}: ContentEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">{title}</p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground/60">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
