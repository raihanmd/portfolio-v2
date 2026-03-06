import { DotFilledIcon } from "@radix-ui/react-icons";
import AnimateItem from "~/_components/animate-item";

import TypingAnimation from "~/_components/typing-animation";

export default function Headline() {
  return (
    <AnimateItem className="relative z-[5] mx-auto flex w-full pb-5">
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
          I build systems that work reliably at scale. Whether it&apos;s
          crafting fullstack applications, understanding infrastructure, or
          exploring how complex systems behave under pressure I&apos;m driven by
          curiosity and a passion for depth. I don&apos;t just ship code; I
          understand how it works, why it works, and where it might break.
          Let&apos;s build something that lasts. 🚀
        </p>
      </div>
    </AnimateItem>
  );
}
