"use client";

import { useEffect } from "react";

interface ContentViewTrackerProps {
  storageKey: string;
  endpoint: string;
}

/**
 * Counts one view per storageKey per browser session: sessionStorage guards
 * refreshes/spam, a debounce skips quick bounces, and the POST is fire-and-
 * forget so tracking never blocks rendering.
 */
export default function ContentViewTracker({
  storageKey,
  endpoint,
}: ContentViewTrackerProps) {
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Storage unavailable (private mode, blocked cookies) — count this mount.
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void fetch(endpoint, {
        method: "POST",
        signal: controller.signal,
      }).catch(() => {
        // Tracking is best-effort; ignore failures.
      });
    }, 1500);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [storageKey, endpoint]);

  return null;
}
