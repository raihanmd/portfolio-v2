import { DotFilledIcon } from "@radix-ui/react-icons";

import { AuroraBackground } from "./_components/ui/aurora-background";
import EventBadge from "./_components/event-badge";
import TypingAnimation from "./_components/typing-animation";

export default function page() {
  return (
    <AuroraBackground>
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="relative z-[5] mx-auto flex w-full px-4 pb-10 pt-24 backdrop-blur-sm lg:px-0">
          <div className="space-y-5">
            <div className="space-y-2">
              <TypingAnimation />
              <div className="flex flex-col text-muted-foreground sm:flex-row sm:gap-3">
                <p className="flex items-center text-muted-foreground">
                  <DotFilledIcon /> IT Enthusiast
                </p>
                <p className="flex items-center text-muted-foreground">
                  <DotFilledIcon /> Based in Ciamis, West Java, ID
                </p>
              </div>
            </div>
            <p className="leading-[1.8] text-foreground/85">
              An IT enthusiast with a strong focus on backend development,
              proficient in TypeScript and Golang. I am always eager to explore
              and adapt to new technologies, driven by curiosity and a passion
              for innovation. I enjoy collaborating with teams to deliver
              efficient, clean, and scalable code, ensuring high performance and
              maintainability in every project.
            </p>
          </div>
        </div>
        <EventBadge />
      </div>
    </AuroraBackground>
  );
}
