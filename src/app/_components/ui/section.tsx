import type { PropsWithChildren } from "react";

type SectionHeaderProps = {
  Icon: React.ElementType;
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
      <Icon className="size-5" />
      {title}
    </h1>
    {description ? (
      <p className="text-muted-foreground">{description}</p>
    ) : null}
  </div>
);
SectionHeader.displayName = "SectionHeader";

const SectionContent = ({ children }: PropsWithChildren) => (
  <div className="space-y-2">{children}</div>
);
SectionContent.displayName = "SectionContent";

export { Section, SectionHeader, SectionContent };
