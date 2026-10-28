import katex from "katex";
import "katex/dist/katex.min.css";

export function MathDisplay({
  equation,
  inline,
}: {
  equation: string;
  inline: boolean;
}) {
  let html: string;
  try {
    html = katex.renderToString(equation, {
      displayMode: !inline,
      throwOnError: true,
      trust: false,
      maxExpand: 1000,
      maxSize: 100,
    });
  } catch {
    return <code>{inline ? `$${equation}$` : `$$${equation}$$`}</code>;
  }

  if (inline) return <span dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <span
      className="my-4 block max-w-full overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
