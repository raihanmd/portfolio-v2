import AnimateItem from "~/_components/animate-item";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import { Separator } from "~/_components/ui/separator";

export default function Summary() {
  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          title="About Me ✨"
          description="Some short story 'bout me"
        />
        <Separator decorative />
        <SectionContent className="space-y-4 text-justify text-primary/90">
          <p>
            My name is Muhammad Raihan Firdaus, I am passionate Web Developer
            specializing in frontend development with a strong command of React,
            TypeScript, and Next.js.
          </p>
          <p>
            My journey in tech started with a deep interest in creating
            user-friendly and visually appealing interfaces, which I&apos;ve
            honed through various projects, including building responsive and
            modern websites. In addition to my frontend expertise, I also have
            solid experience in backend development, particularly with Golang
            and Nest.js.
          </p>
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
