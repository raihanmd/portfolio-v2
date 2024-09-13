import { DotFilledIcon } from "@radix-ui/react-icons";

import TypingAnimation from "./_components/typing-animation";
import { AuroraBackground } from "./_components/ui/aurora-background";

export default function page() {
  return (
    <AuroraBackground>
      <div className="relative z-[5] mx-auto flex w-full max-w-3xl pt-24">
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
            and adapt to new technologies, driven by curiosity and a passion for
            innovation. I enjoy collaborating with teams to deliver efficient,
            clean, and scalable code, ensuring high performance and
            maintainability in every project.
          </p>
        </div>
      </div>
    </AuroraBackground>
  );
}
