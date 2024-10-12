import { CodeIcon } from "@radix-ui/react-icons";
import { Section, SectionHeader } from "./ui/section";

export default function Service() {
  return (
    <Section>
      <SectionHeader
        Icon={CodeIcon}
        title="Services"
        description="I can provide theese following services"
      />
    </Section>
  );
}
