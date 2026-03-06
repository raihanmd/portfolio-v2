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
          title="About Me"
          description="A journey from shipping to understanding"
        />
        <Separator decorative />
        <SectionContent className="space-y-4 text-justify text-primary/90">
          <p>
            Early on, I was focused on velocity shipping features, crossing off
            tasks, getting products to users as fast as possible. It worked,
            until it didn&apos;t. Production issues, performance bottlenecks,
            and unexpected bugs revealed something crucial: using tools is very
            different from understanding how they work.
          </p>
          <p>
            That realization sparked something in me. I became obsessed with the
            systems beneath the surface how requests flow through networks, how
            databases execute queries, how small architectural decisions
            compound at scale. This curiosity pulled me beyond frontend. I
            started exploring backend systems, infrastructure, containerization,
            and the subtle interactions between components.
          </p>
          <p>
            I&apos;ve spent considerable time understanding not just what to
            build, but why it behaves the way it does in production. From
            database internals to blockchain systems, from CI/CD pipelines to
            system design the common thread is always the same: I want to
            understand the thing, not just use it.
          </p>
          <p>
            If there&apos;s one thing that shapes how I approach engineering,
            it&apos;s this: I don&apos;t stop at &quot;it works.&quot; I want to
            understand how it works, why it works, and where it might break. I
            enjoy building products, but I&apos;m equally fascinated by the
            systems that make them reliable, efficient, and scalable.
          </p>
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
