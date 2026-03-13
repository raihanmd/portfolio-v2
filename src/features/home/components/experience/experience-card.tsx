import type { TExperience } from "~/types";
import { Card, CardHeader } from "../../../../_components/ui/card";
import Link from "next/link";
import AnimateItem from "~/_components/animate-item";
import { Dot } from "lucide-react";

type ExperienceCardProps = {
  experience: TExperience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <AnimateItem>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-center">
                {experience.href ? (
                  <Link
                    href={experience.href}
                    target="_blank"
                    className="font-semibold text-foreground/80 transition-none hover:underline"
                  >
                    {experience.company}
                  </Link>
                ) : (
                  <h2 className="font-semibold text-foreground/80 transition-none">
                    {experience.company}
                  </h2>
                )}
                {experience?.country && (
                  <>
                    <Dot />
                    <p className="text-sm text-foreground/60">
                      {experience.country}
                    </p>
                  </>
                )}
              </div>
              <h3 className="text-muted-foreground/80">
                {experience.position}
              </h3>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {experience.date_start} - {experience.date_end}
            </p>
          </div>
        </CardHeader>
      </Card>
    </AnimateItem>
  );
}
