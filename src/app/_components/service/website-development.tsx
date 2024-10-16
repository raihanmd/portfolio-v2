import { cn } from "~/lib/cn";
import Each from "../each";
import { Skeleton } from "../ui/skeleton";

const WebsiteDevelopment = () => (
  <div className="relative mx-auto h-40 w-full max-w-56 overflow-hidden rounded-lg border border-border bg-background">
    <div className="border-borderbg-muted/30 absolute inset-0 flex h-4 items-center border-b bg-muted/50 px-1">
      <Each
        of={new Array(3).fill(null)}
        render={(_, i) => (
          <div
            key={i}
            className={cn("mx-[2px] size-2 rounded-full", {
              "bg-destructive": i === 0,
              "bg-warning/60": i === 1,
              "bg-success/50": i === 2,
            })}
          />
        )}
      />
    </div>
    <div className="relative flex size-full justify-center px-4 pt-4">
      <div className="flex w-full gap-2 pt-4">
        <div className="flex w-1/4 flex-col gap-2">
          <div className="aspect-square w-full rounded-full border border-border" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-1.5 w-full" />
            <Skeleton className="h-1.5 w-full" />
            <Skeleton className="h-1.5 w-2/3" />
          </div>
        </div>
        <div className="flex w-3/4 flex-col gap-1.5">
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="h-2 w-full" />
          </div>
          <Each
            of={new Array(2).fill(null)}
            render={() => (
              <div className="grid grid-cols-2 gap-1">
                <div className="animate-shine aspect-video rounded-md bg-gradient-to-r from-border via-border/75 to-border bg-[length:400%_100%]" />
                <div className="flex flex-col justify-center gap-1">
                  <Skeleton className="h-1.5 w-full" />
                  <Skeleton className="h-1.5 w-2/3" />
                  <Skeleton className="h-1.5 w-4/5" />
                </div>
              </div>
            )}
          />
        </div>
      </div>
      <div className="absolute bottom-0 flex w-full items-center justify-between px-4 pb-2">
        <Skeleton className="h-1.5 w-1/3" />
        <div className="flex gap-1">
          <Each
            of={new Array(3).fill(null)}
            render={() => (
              <div className="size-2 rounded-full border border-border" />
            )}
          />
        </div>
      </div>
    </div>
  </div>
);

export { WebsiteDevelopment };
