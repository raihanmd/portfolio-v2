import { TExperience } from "~/types";
import { Card, CardHeader } from "./ui/card";

type ExperienceCardProps = {
  experience: TExperience;
};

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-light">{experience.company}</h2>
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
