import { DotFilledIcon } from "@radix-ui/react-icons";
import { lazy } from "react";

import TypingAnimation from "./_components/typing-animation";
import { Separator } from "./_components/ui/separator";

const EventBadge = lazy(() => import("./_components/event-badge"));
const AuroraBackground = lazy(
  () => import("./_components/ui/aurora-background"),
);

export default function page() {
  return (
    <AuroraBackground>
      <EventBadge />
      <div className="container mx-auto h-full">
        <div className="relative z-[5] mx-auto flex w-full px-4 pb-5 pt-24 backdrop-blur-sm [--webkit-mask-image:linear-gradient(to_bottom,_black_90%,_transparent)] [mask-image:linear-gradient(to_bottom,_black_90%,_transparent)] lg:px-0">
          <div className="space-y-5">
            <div className="space-y-2">
              <TypingAnimation />
              <div className="flex flex-col text-muted-foreground sm:flex-row sm:gap-3">
                <p className="flex items-center text-muted-foreground">
                  <DotFilledIcon /> Software Engineer
                </p>
                <p className="flex items-center text-muted-foreground">
                  <DotFilledIcon /> Based in Ciamis, West Java, ID
                </p>
              </div>
            </div>
            <p className="leading-[1.8] text-foreground/85">
              Hey there! 👋 I'm a software engineer who thrives on crafting epic
              web apps and making the web a more delightful place. I&apos;m all
              about learning new things and tackling fresh challenges with a
              smile. 😊 Clean, efficient code? That&apos;s my jam! Let&apos;s
              build something awesome together! 🚀
            </p>
          </div>
        </div>
        <Separator />
      </div>
    </AuroraBackground>
  );
}
