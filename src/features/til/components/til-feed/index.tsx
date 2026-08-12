"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Til } from "../../../../../payload-types";
import AnimateFade from "~/_components/animate-fade";
import TilEmpty from "../til-empty";
import TilError from "../til-error";
import TilInfiniteScroll from "../til-infinite-scroll";
import TilRow from "../til-row";
import TilSkeleton from "../til-skeleton";

const PAGE_SIZE = 10;

interface TilListResponse {
  docs: Til[];
  hasNextPage: boolean;
  nextPage: number | null;
  totalDocs: number;
}

type FeedStatus = "loading" | "loaded" | "loadingMore" | "error";

export default function TilFeed() {
  const [docs, setDocs] = useState<Til[]>([]);
  const [status, setStatus] = useState<FeedStatus>("loading");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bumped on every fetch to invalidate stale in-flight requests (StrictMode double-effect, unmount).
  const requestIdRef = useRef(0);
  const isFetchingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const failedPageRef = useRef(1);

  const fetchPage = useCallback(
    async (page: number, mode: "initial" | "more") => {
      const requestId = ++requestIdRef.current;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      isFetchingRef.current = true;
      failedPageRef.current = page;

      if (mode === "initial") {
        setStatus("loading");
      } else {
        setStatus("loadingMore");
      }

      try {
        const response = await fetch(
          `/api/tils?limit=${PAGE_SIZE}&page=${page}&sort=-date`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Failed to load TILs (${response.status})`);
        }
        const data = (await response.json()) as TilListResponse;

        if (requestId !== requestIdRef.current) return;

        setDocs((previous) => {
          const seen = new Set(previous.map((doc) => doc.id));
          const merged = [...previous];
          for (const doc of data.docs) {
            if (!seen.has(doc.id)) {
              seen.add(doc.id);
              merged.push(doc);
            }
          }
          return merged;
        });
        setHasNextPage(data.hasNextPage);
        setNextPage(data.nextPage);
        setStatus("loaded");
      } catch (error) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong",
        );
        setStatus("error");
      } finally {
        if (requestId === requestIdRef.current) {
          isFetchingRef.current = false;
        }
      }
    },
    [],
  );

  useEffect(() => {
    void fetchPage(1, "initial");
    return () => {
      requestIdRef.current += 1;
      isFetchingRef.current = false;
      abortRef.current?.abort();
    };
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isFetchingRef.current) return;
    if (!hasNextPage || nextPage === null) return;
    void fetchPage(nextPage, "more");
  }, [fetchPage, hasNextPage, nextPage]);

  const retry = useCallback(() => {
    const mode = docs.length === 0 ? "initial" : "more";
    void fetchPage(failedPageRef.current, mode);
  }, [docs.length, fetchPage]);

  const showInitialSkeleton = status === "loading" && docs.length === 0;
  const showInitialError = status === "error" && docs.length === 0;

  return (
    <div className="relative">
      {/* Crossfade the skeleton out while the feed fades in, so the swap never
          leaves a blank blink between the two states. */}
      <AnimatePresence mode="wait" initial={false}>
        {showInitialSkeleton ? (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
          >
            <TilSkeleton count={5} />
          </motion.div>
        ) : showInitialError ? (
          <motion.div
            key="error"
            exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
          >
            <TilError message={errorMessage} onRetry={retry} />
          </motion.div>
        ) : docs.length === 0 ? (
          <motion.div
            key="empty"
            exit={{ opacity: 0, transition: { duration: 0.12, ease: "easeOut" } }}
          >
            <TilEmpty />
          </motion.div>
        ) : (
          <motion.div
            key="feed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18, ease: "easeOut" } }}
          >
            <AnimateFade
              fadeContainer={false}
              staggerChildren={0.06}
              className="space-y-4"
            >
              {docs.map((til) => (
                <TilRow key={til.id} til={til} />
              ))}
            </AnimateFade>

            {status === "error" ? (
              <div className="pt-8">
                <TilError message={errorMessage} onRetry={retry} />
              </div>
            ) : (
              <TilInfiniteScroll
                hasNextPage={hasNextPage}
                isLoading={status === "loadingMore"}
                onLoadMore={loadMore}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
