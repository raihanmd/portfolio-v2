import { DotFilledIcon } from "@radix-ui/react-icons";
import { AuroraBackground } from "./_components/ui/aurora-background";

export default function page() {
  return (
    <AuroraBackground>
      <div className="relative z-[5] mx-auto flex w-full max-w-4xl pt-24">
        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              Hello buddy, I'm Raihanmd.
            </h1>
            <div className="flex flex-col gap-2 text-muted-foreground lg:flex-row">
              <p className="flex items-center justify-center gap-1 text-muted-foreground">
                <DotFilledIcon /> IT Enthusiast
              </p>
              <p className="flex items-center justify-center gap-1 text-muted-foreground">
                <DotFilledIcon /> Based in Ciamis{" "}
                <span className="mb-auto text-xs">West Java, ID</span>
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
