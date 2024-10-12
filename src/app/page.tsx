import { lazy } from "react";

import { Separator } from "./_components/ui/separator";
import Headline from "./_components/headline";
import Experience from "./_components/experience";
import Service from "./_components/service";

const EventBadge = lazy(() => import("./_components/event-badge"));
const AuroraBackground = lazy(
  () => import("./_components/ui/aurora-background"),
);

export default function page() {
  return (
    <AuroraBackground>
      {/* <EventBadge /> */}
      <div className="container mx-auto h-full px-6 lg:px-0">
        <Headline />
        <Separator />
        <Experience />
        <Separator />
        <Service />
      </div>
    </AuroraBackground>
  );
}
