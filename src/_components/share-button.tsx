"use client";

import { CheckIcon, Share1Icon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

import { Button } from "~/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/_components/ui/tooltip";
import { cn } from "~/lib/cn";

interface ShareButtonProps {
  title: string;
  ariaLabel?: string;
  className?: string;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function ShareButton({
  title,
  ariaLabel = "Share this page",
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url });
        return;
      }
      await copyText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sharing is best-effort and may be dismissed by the user.
    }
  }, [title]);

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            aria-label={copied ? "Link copied" : ariaLabel}
            title={copied ? "Link copied" : "Share"}
            className={cn(
              "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground",
              className,
            )}
          >
            {copied ? (
              <CheckIcon className="size-4" />
            ) : (
              <Share1Icon className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {copied ? "Link copied" : "Share"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
