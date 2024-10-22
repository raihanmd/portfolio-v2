import {
  Section,
  SectionContent,
  SectionHeader,
} from "../_components/ui/section";
import { Separator } from "../_components/ui/separator";
import EventBadgeContainer from "../_components/event-badge-container";
export default function Page() {
  return (
    <>
      <EventBadgeContainer />
      <div className="container px-6 pt-16 lg:px-0 xl:max-w-[768px] xl:px-12 xl:backdrop-blur-sm xl:[-webkit-mask-image:linear-gradient(to_left,_black_95%,_transparent)] xl:[mask-image:linear-gradient(to_left,_black_95%,_transparent)]">
        <Section>
          <SectionHeader
            title="About Me"
            description="Some short story 'bout me"
          />
          <Separator decorative />
          <SectionContent className="space-y-4 text-justify text-primary/90">
            <p>
              My name is Muhammad Raihan Firdaus, I am passionate Web Developer
              specializing in frontend development with a strong command of
              React, TypeScript, and Next.js.
            </p>
            <p>
              My journey in tech started with a deep interest in creating
              user-friendly and visually appealing interfaces, which I&apos;ve
              honed through various projects, including building responsive and
              modern websites. In addition to my frontend expertise, I also have
              solid experience in backend development, particularly with Golang
              and Nest.js.
            </p>
            <p>
              I enjoy working on both sides of the stack, ensuring seamless
              integration and efficient performance across the entire
              application. My academic background includes graduating top of my
              class in Computer and Network Engineering from SMK Miftahussalam
              Ciamis. I&apos;ve also completed intensive training programs,
              including the Superbootcamp Hibah Disnaker Jawa Barat 2024, where
              I expanded my skills in Golang and Next.js. I&apos;ve also
              contributed to open source projects, showcasing my commitment to
              continuous learning and growth.
            </p>
          </SectionContent>
        </Section>
      </div>
    </>
  );
}
