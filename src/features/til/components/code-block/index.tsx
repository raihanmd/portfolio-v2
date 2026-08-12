"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Highlight, Prism, themes } from "prism-react-renderer";
import { useCallback, useState } from "react";

import { Button } from "~/_components/ui/button";
import { cn } from "~/lib/cn";

interface CodeBlockProps {
  code: string;
  language: string;
}

/**
 * Maps the Monaco language key stored by the Payload CodeBlock to a Prism
 * language bundled in prism-react-renderer. Falls back to plaintext so an
 * unregistered language never crashes Highlight.
 */
function resolveLanguage(language: string): string {
  const key = language.toLowerCase();
  return key in Prism.languages ? key : "plaintext";
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — ignore.
    }
  }, [code]);

  const prismTheme =
    resolvedTheme === "dark" ? themes.oneDark : themes.oneLight;

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted py-1.5 pl-4 pr-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {language || "plaintext"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code"}
          title={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <Highlight
        theme={prismTheme}
        code={code.trimEnd()}
        language={resolveLanguage(language)}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              "overflow-x-auto p-4 font-mono text-[13px] leading-relaxed",
              className,
            )}
            style={style}
          >
            {tokens.map((line, index) => (
              <div key={index} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
