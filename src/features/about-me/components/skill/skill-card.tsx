import { cn } from "~/lib/cn";
import type { TSkill } from "~/constant/skill";
import { memo } from "react";

type SkillCardProps = {
  skill: TSkill;
};

function SkillCard({ skill }: SkillCardProps) {
  return (
    <figure
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border p-3",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <skill.icon className={cn("size-5", skill.color)} />
        <p className="text-xs font-medium text-muted-foreground">
          {skill.name}
        </p>
      </div>
    </figure>
  );
}

export default memo(SkillCard);
