import RichContent from "~/_components/rich-content";
import type { Til } from "../../../../../payload-types";

export default function TilRichText({ til }: { til: Til }) {
  return <RichContent content={til.content} />;
}
