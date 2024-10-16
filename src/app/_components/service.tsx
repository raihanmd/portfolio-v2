import { CodeIcon } from "@radix-ui/react-icons";
import { Section, SectionContent, SectionHeader } from "./ui/section";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { SERVICE } from "~/constant/service";
import Each from "./each";

export default function Service() {
  return (
    <Section>
      <SectionHeader
        Icon={CodeIcon}
        title="Services"
        description="I'ts what can i do for you"
      />
      <SectionContent className="grid gap-4 sm:grid-cols-2">
        <Each
          of={SERVICE}
          render={(service) => (
            <Card
              key={service.title}
              className="relative mx-0 overflow-hidden border border-border hover:bg-transparent"
            >
              <CardContent className="p-2 pb-5">
                <div className="absolute -top-[84px] z-[-1] -m-2 size-full bg-grid-small-black/20 [mask-image:radial-gradient(circle,black_0%,black_50%,transparent_75%)] dark:bg-grid-small-white/20" />
                <div className="flex flex-col gap-5">
                  <Badge variant={"success"} className="ml-auto">
                    {service.badge}
                  </Badge>
                  <service.animation />
                  <div className="px-2">
                    <h2 className="text-lg font-semibold">{service.title}</h2>
                    <p className="text-sm text-muted-foreground/80">
                      {service.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        />
      </SectionContent>
    </Section>
  );
}
