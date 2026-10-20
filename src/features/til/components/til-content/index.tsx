import RichContent from "~/_components/rich-content";
import type { Til } from "../../../../../payload-types";

export default function TilRichText({
  til,
  enableHeadingAnchors = false,
  layout = "prose",
}: {
  til: Til;
  enableHeadingAnchors?: boolean;
  layout?: "prose" | "adaptive";
}) {
  return (
    <RichContent
      content={til.content}
      enableHeadingAnchors={enableHeadingAnchors}
      layout={layout}
    />
  );
}
