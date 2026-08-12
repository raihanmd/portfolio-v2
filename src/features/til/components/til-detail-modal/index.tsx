"use client";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "~/_components/ui/dialog";
import { formatTilDate } from "~/lib/til-date";
import type { Til } from "../../../../../payload-types";
import TilRichText from "../til-content";
import TilShareButton from "../til-share-button";

interface TilDetailModalProps {
  til: Til;
}

export default function TilDetailModal({ til }: TilDetailModalProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      {/* overflow-x-hidden: CSS computes overflow-x to auto when overflow-y is
          auto, so the dialog gains a horizontal scrollbar the moment any child
          is even 1px wider (font-swap reflow, code block placeholder→highlight
          swap). The standalone page clips this via Card overflow-hidden — the
          dialog must do the same. The code block keeps its own overflow-x-auto. */}
      <DialogContent className="max-w-3xl overflow-x-hidden">
        <DialogHeader className="hidden" />
        {/* min-w-0 is required: the grid item must be allowed to shrink below
            the min-content width of the code block, otherwise the dialog
            grows past max-w-3xl and scrolls horizontally. */}
        <div className="min-w-0 pt-4">
          <div className="flex items-center justify-between">
            <time
              dateTime={til.date}
              className="font-mono text-xs uppercase leading-4 tracking-wider text-muted-foreground"
            >
              {formatTilDate(til.date)}
            </time>
            <TilShareButton title={`TIL · ${formatTilDate(til.date)}`} />
          </div>
          <div className="mt-4">
            <TilRichText til={til} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
