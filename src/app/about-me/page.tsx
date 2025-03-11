import { type Metadata } from "next";
import Summary from "~/features/about-me/components/summary";
import EventBadgeContainer from "~/features/about-me/components/event-badge/event-badge-container";
import Skill from "~/features/about-me/components/skill";
import { Separator } from "~/_components/ui/separator";
import GithubCalendar from "~/features/about-me/components/github-calendar";
import AnimateFade from "~/_components/animate-fade";

export const metadata: Metadata = {
  title: "Raihanmd | About Me",
  description: "About me",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Raihanmd | About Me",
    description: "About me",
    type: "website",
    images: "https://avatars.githubusercontent.com/u/100277303?v=4",
    siteName: "Raihanmd",
    countryName: "Indonesia",
    emails: "mraihanf471@gmail.com",
    locale: "en",
  },
  authors: { name: "Raihanmd", url: "https://github.com/raihanmd" },
};

export const dynamic = "force-static";

export const revalidate = 60 * 60 * 24;

export default function Page() {
  return (
    <>
      <EventBadgeContainer />
      <AnimateFade
        staggerChildren={0.2}
        className="container px-6 pt-16 lg:px-0 xl:max-w-[768px] xl:px-12 xl:backdrop-blur-sm xl:[-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] xl:[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <Summary />
        <Separator decorative />
        <Skill />
        <Separator decorative />
        <GithubCalendar />
      </AnimateFade>
    </>
  );
}
