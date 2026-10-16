"use client";

import { useEffect } from "react";

export default function BlogViewTracker({ id }: { id: number }) {
  useEffect(() => {
    const key = `blog:view:${id}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Count this mount if browser storage is unavailable.
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch(`/api/blogs/${id}/view`, {
        method: "POST",
        signal: controller.signal,
      }).catch(() => undefined);
    }, 1500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [id]);

  return null;
}
