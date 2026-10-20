import RichContent from "~/_components/rich-content";
import type { Til } from "../../../../../payload-types";

export default function TilRichText({
  til,
  enableHeadingAnchors = false,
}: {
  til: Til;
  enableHeadingAnchors?: boolean;
}) {
  return (
    <RichContent
      content={til.content}
      enableHeadingAnchors={enableHeadingAnchors}
    />
  );
}
