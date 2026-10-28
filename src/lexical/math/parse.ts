export function findInlineMath(text: string) {
  const escaped = (index: number) => {
    let slashes = 0;
    while (index > 0 && text[--index] === "\\") slashes++;
    return slashes % 2 === 1;
  };

  for (let start = 0; start < text.length; start++) {
    if (
      text[start] !== "$" ||
      escaped(start) ||
      text[start - 1] === "$" ||
      text[start + 1] === "$" ||
      !text[start + 1] ||
      /\s/.test(text[start + 1]!)
    )
      continue;

    for (let end = start + 1; end < text.length; end++) {
      if (text[end] === "\n") break;
      if (text[end] !== "$" || escaped(end)) continue;
      if (
        text[end - 1] === "$" ||
        text[end + 1] === "$" ||
        /\s/.test(text[end - 1]!) ||
        /\d/.test(text[end + 1] ?? "")
      )
        break;
      const equation = text.slice(start + 1, end);
      if (/^\d[\d,.]*[-+/:,]$/.test(equation)) break;
      return { start, end: end + 1, equation };
    }
  }
  return null;
}

export function findBlockMath(text: string) {
  const match = /^\s*\$\$([\s\S]+?)\$\$\s*$/.exec(text);
  const equation = match?.[1]?.trim();
  if (!equation) return null;
  return equation;
}
