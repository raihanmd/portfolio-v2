import type { Metadata } from "next";
import { Separator } from "../_components/ui/separator";
import Experience from "~/features/home/components/experience";
import Service from "~/features/home/components/service";
import Headline from "~/features/home/components/headline";
import AuroraBackground from "~/_components/ui/aurora-background";
import AnimateFade from "~/_components/animate-fade";

export const metadata: Metadata = {
  title: "Raihanmd | Home",
  description: "Home",
};

export default function page() {
  return (
    <AuroraBackground>
      <AnimateFade
        staggerChildren={0.3}
        className="container mx-auto h-full px-6 pt-24 lg:px-0"
      >
        <Headline />
        <Separator decorative />
        <Experience />
        <Separator decorative />
        <Service />
      </AnimateFade>
    </AuroraBackground>
  );
}
