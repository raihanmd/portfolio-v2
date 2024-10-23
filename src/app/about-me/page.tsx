import { type Metadata } from "next";
import Summary from "~/features/about-me/components/summary";
import EventBadgeContainer from "~/features/about-me/components/event-badge/event-badge-container";
import Skill from "~/features/about-me/components/skill";
import { Separator } from "~/_components/ui/separator";

export const metadata: Metadata = {
  title: "Raihanmd | About Me",
  description: "About me",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Raihanmd | About Me",
    description: "About me",
  },
  authors: { name: "Raihanmd", url: "https://github.com/raihanmd" },
};

export default function Page() {
  return (
    <>
      <EventBadgeContainer />
      <div className="container px-6 pt-16 lg:px-0 xl:max-w-[768px] xl:px-12 xl:backdrop-blur-sm xl:[-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] xl:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <Summary />
        <Separator decorative />
        <Skill />
      </div>
    </>
  );
}
