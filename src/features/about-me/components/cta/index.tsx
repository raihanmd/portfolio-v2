import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import AnimateItem from "~/_components/animate-item";
import { Button } from "~/_components/ui/button";
import { cn } from "~/lib/cn";

export default function CTA() {
  return (
    <AnimateItem className="py-12">
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-3xl flex-col justify-between gap-y-6 border-y bg-[radial-gradient(35%_80%_at_25%_0%,hsl(var(--foreground)/.08),transparent)] px-4 py-8",
        )}
      >
        {/* Corner decorations */}
        <PlusIcon
          className="z-1 absolute left-[-11.5px] top-[-12.5px] size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="z-1 absolute right-[-11.5px] top-[-12.5px] size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="z-1 absolute bottom-[-12.5px] left-[-11.5px] size-6 text-muted-foreground/50"
          strokeWidth={1}
        />
        <PlusIcon
          className="z-1 absolute bottom-[-12.5px] right-[-11.5px] size-6 text-muted-foreground/50"
          strokeWidth={1}
        />

        {/* Vertical borders */}
        <div className="pointer-events-none absolute -inset-y-6 left-0 w-px border-l border-border" />
        <div className="pointer-events-none absolute -inset-y-6 right-0 w-px border-r border-border" />
        <div className="absolute left-1/2 top-0 -z-10 h-full border-l border-dashed border-border/50" />

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-center text-2xl font-bold">
            If you think the same way, let&apos;s connect.
          </h2>
          <p className="text-center text-muted-foreground">
            Whether you&apos;re building the next big thing or solving a
            system-level challenge, I&apos;d love to explore opportunities where
            we can dig deeper together.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href="https://github.com/raihanmd" target="_blank">
              GitHub Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="mailto:me@raihanmd.xyz">
              Get in Touch <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </AnimateItem>
  );
}
