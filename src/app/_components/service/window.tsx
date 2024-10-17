import { PropsWithChildren } from "react";
import Each from "../each";
import { cn } from "~/lib/cn";

const Window = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative mx-auto h-40 w-full max-w-56 overflow-hidden rounded-lg border border-border bg-background">
      <div className="border-borderbg-muted/30 absolute inset-0 flex h-4 items-center border-b bg-muted/50 px-1">
        <Each
          of={new Array(3).fill(null)}
          render={(_, i) => (
            <div
              key={i}
              className={cn("mx-[2px] size-2 animate-pulse rounded-full", {
                "bg-destructive": i === 0,
                "bg-warning/60 delay-150": i === 1,
                "bg-success/50 delay-300": i === 2,
              })}
            />
          )}
        />
      </div>
      {children}
    </div>
  );
};
Window.displayName = "Window";

export { Window };
