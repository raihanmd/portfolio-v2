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
          Hey there! 👋 I&apos;m a software engineer who thrives on crafting
          epic web apps and making the web a more delightful place. I&apos;m all
          about learning new things and tackling fresh challenges with a smile.
          😊 Clean, efficient code? That&apos;s my jam! Let&apos;s build
          something awesome together! 🚀
        </p>
      </div>
    </AnimateItem>
  );
}
