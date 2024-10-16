import dynamic from "next/dynamic";

import { Separator } from "./_components/ui/separator";
import Headline from "./_components/headline";
import Experience from "./_components/experience";
import Service from "./_components/service";

const AuroraBackground = dynamic(
  () => import("./_components/ui/aurora-background"),
  {
    ssr: true,
    loading: () => {
      return <div className="h-screen w-full bg-background" />;
    },
  },
);

export default function page() {
  return (
    <AuroraBackground>
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
