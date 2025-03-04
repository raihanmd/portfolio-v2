import type { PropsWithChildren } from "react";
import React from "react";
import { cn } from "~/lib/cn";

type SectionHeaderProps = {
  Icon?: React.ElementType;
  title: string;
  description?: string;
};

const Section = ({ children }: PropsWithChildren) => (
  <div className="relative z-[5] space-y-4 py-5">{children}</div>
);
Section.displayName = "Section";

const SectionHeader = ({ title, description, Icon }: SectionHeaderProps) => (
  <div className="space-y-2">
    <h1 className="flex flex-row items-center gap-3 text-lg font-semibold">
      {Icon ? <Icon className="size-5" /> : null}
      {title}
    </h1>
    {description ? (
      <p className="text-muted-foreground">{description}</p>
    ) : null}
  </div>
);
SectionHeader.displayName = "SectionHeader";

type SectionContentProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const SectionContent = ({ children, ...props }: SectionContentProps) => (
  <div className={cn("space-y-2", props.className)} {...props}>
    {children}
  </div>
);
SectionContent.displayName = "SectionContent";

export { Section, SectionHeader, SectionContent };
