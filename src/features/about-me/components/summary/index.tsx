import AnimateItem from "~/_components/animate-item";
import {
  Section,
  SectionContent,
  SectionHeader,
} from "~/_components/ui/section";
import { Separator } from "~/_components/ui/separator";
import { Kbd } from "~/_components/ui/kbd";

export default function Summary() {
  return (
    <AnimateItem>
      <Section>
        <SectionHeader
          title="About Me"
          description="A journey from shipping to understanding"
        />
        <Separator decorative />
        <SectionContent className="space-y-4 text-justify text-primary/80">
          <p className="leading-relaxed">
            Early on, I was focused on velocity, shipping features, crossing off
            tasks, and getting products to users as fast as possible. It worked,
            until it didn&apos;t. Production issues, performance bottlenecks,
            and unexpected bugs revealed something crucial: using tools is very
            different from truly understanding how they work.
          </p>
          <p className="leading-relaxed">
            That realization pulled me deeper, past the surface of web
            development and into the infrastructure that powers trustless
            systems. I grew fascinated by how smart contracts execute
            deterministically on-chain, how consensus mechanisms coordinate
            distributed nodes without central authority, and how protocol design
            decisions ripple into real economic consequences for users.
            Blockchain wasn&apos;t just another tool, it was a fundamentally
            different mental model for building systems.
          </p>
          <p className="leading-relaxed">
            Today I work across the full stack, from crafting frontend
            interfaces to writing and auditing smart contracts in Solidity. I
            care deeply about security, understanding attack vectors, invariant
            violations, and how a single misplaced assumption can drain a
            protocol. I&apos;ve explored DeFi primitives, studied audit reports,
            and built on-chain systems with a security-first mindset.
          </p>
          <p className="leading-relaxed">
            If there&apos;s one principle that defines how I approach
            engineering, on-chain or off, it&apos;s this: I don&apos;t stop at{" "}
            <Kbd className="text-xs font-normal">&quot;it works.&quot;</Kbd>I
            want to know <em>how</em> it works, <em>why</em> it works, and{" "}
            <em>where</em> it might break. The stakes are higher on-chain, there
            are no rollbacks, no hotfixes, no support tickets. Just immutable
            code and the consequences of its design.
          </p>
        </SectionContent>
      </Section>
    </AnimateItem>
  );
}
