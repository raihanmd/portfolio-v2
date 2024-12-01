import type { TExperience } from "~/types";
import { Card, CardHeader } from "../../../../_components/ui/card";
import Link from "next/link";

type ExperienceCardProps = {
  experience: TExperience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            {experience.href ? (
              <Link
                href={experience.href}
                className="font-light transition-none hover:underline"
              >
                {experience.company}
              </Link>
            ) : (
              <h2 className="font-light transition-none">
                {experience.company}
              </h2>
            )}
            <h3 className="text-muted-foreground">{experience.position}</h3>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {experience.date_start} - {experience.date_end}
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
