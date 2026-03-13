import { cn } from "~/lib/cn";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "border border-border/60 bg-muted text-foreground shadow-[0_2px_0_0_hsl(var(--border))]",
        "pointer-events-none inline-flex h-auto w-fit select-none items-center justify-center gap-1",
        "rounded-md px-2 py-0.5 font-mono text-sm font-semibold",
        "[&_svg:not([class*='size-'])]:size-3.5",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className,
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
