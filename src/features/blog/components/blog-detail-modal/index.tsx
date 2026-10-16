"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import RichContent from "~/_components/rich-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/_components/ui/dialog";
import type { Blog, Til } from "../../../../../payload-types";
import { formatBlogDate } from "~/lib/blog-date";
import BlogShareButton from "../blog-share-button";

interface BlogDetailModalProps {
  blog: Blog;
}

export default function BlogDetailModal({ blog }: BlogDetailModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      {/* overflow-x-hidden: CSS computes overflow-x to auto when overflow-y is
          auto, so the dialog gains a horizontal scrollbar the moment any child
          is even 1px wider (font-swap reflow, code block placeholder→highlight
          swap). The standalone page clips this via Card overflow-hidden — the
          dialog must do the same. The code block keeps its own overflow-x-auto. */}
      <DialogContent className="max-h-[85dvh] max-w-3xl overflow-x-hidden sm:max-h-[80dvh]">
        <DialogHeader className="sr-only">
          <DialogTitle>{blog.title}</DialogTitle>
          <DialogDescription>Read the full article.</DialogDescription>
        </DialogHeader>
        {/* min-w-0 is required: the grid item must be allowed to shrink below
            the min-content width of the code block, otherwise the dialog
            grows past max-w-3xl and scrolls horizontally. */}
        <div className="min-w-0 pt-4">
          <div className="flex items-center justify-between">
            {blog.publishedAt && (
              <time
                dateTime={blog.publishedAt}
                className="font-mono text-xs uppercase leading-4 tracking-wider text-muted-foreground"
              >
                {formatBlogDate(blog.publishedAt)}
              </time>
            )}
            <BlogShareButton title={blog.title} />
          </div>
          <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight">
            {blog.title}
          </h2>
          <div className="mt-4">
            <RichContent content={blog.content as Til["content"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
