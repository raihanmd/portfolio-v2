import { CodeIcon } from "@radix-ui/react-icons";

import Each from "~/_components/each";
import { Badge } from "~/_components/ui/badge";
import { Card, CardContent } from "~/_components/ui/card";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import { SERVICE } from "~/constant/service";

export default function Service() {
  return (
    <Section>
      <SectionHeader
        Icon={CodeIcon}
        title="Services"
        description="Theese are what can i do for you"
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
                  <div className="flex justify-end gap-1">
                    <Each
                      of={service.badges}
                      render={(badge) => (
                        <Badge variant={"success"}>{badge}</Badge>
                      )}
                    />
                  </div>
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
