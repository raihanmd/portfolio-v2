"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AnimateFade from "~/_components/animate-fade";
import ContentEmptyState from "~/_components/content-empty-state";
import ContentListSkeleton from "~/_components/content-list-skeleton";
import ContentResultsTransition from "~/_components/content-results-transition";
import PlaygroundError from "../playground-error";
import PlaygroundRow, { type PlaygroundSummary } from "../playground-row";

const PAGE_SIZE = 50;

interface PlaygroundListResponse {
  docs: PlaygroundSummary[];
  hasNextPage: boolean;
  totalDocs: number;
}

type FeedStatus = "loading" | "loaded" | "error";

export default function PlaygroundFeed() {
  const [playgrounds, setPlaygrounds] = useState<PlaygroundSummary[]>([]);
  const [status, setStatus] = useState<FeedStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPlaygrounds = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");

    try {
      const response = await fetch(
        `/api/playgrounds?limit=${PAGE_SIZE}&sort=-publishedAt&depth=0&select[name]=1&select[slug]=1&select[description]=1&select[publishedAt]=1`,
        { signal: controller.signal },
      );
      if (!response.ok) {
        throw new Error(
          `Failed to load playgrounds (${response.status})`,
        );
      }
      const data = (await response.json()) as PlaygroundListResponse;

      if (requestId !== requestIdRef.current) return;

      setPlaygrounds(data.docs);
      setStatus("loaded");
    } catch (error) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void fetchPlaygrounds();
    return () => {
      requestIdRef.current += 1;
      abortRef.current?.abort();
    };
  }, [fetchPlaygrounds]);

  const showInitialSkeleton = status === "loading" && playgrounds.length === 0;
  const showInitialError = status === "error" && playgrounds.length === 0;

  const transitionKey = showInitialSkeleton
    ? "skeleton"
    : showInitialError
      ? "error"
      : playgrounds.length === 0
        ? "empty"
        : "feed";

  return (
    <ContentResultsTransition transitionKey={transitionKey}>
      {showInitialSkeleton ? (
        <ContentListSkeleton count={3} initialDelay variant="playground" />
      ) : showInitialError ? (
        <PlaygroundError
          message={errorMessage}
          onRetry={() => void fetchPlaygrounds()}
        />
      ) : playgrounds.length === 0 ? (
        <ContentEmptyState
          title="No playgrounds published yet"
          description="Interactive tools will appear here after they are published."
        />
      ) : (
        <AnimateFade
          fadeContainer={false}
          staggerChildren={0.08}
          deferUntilMounted
          className="space-y-4"
        >
          {playgrounds.map((playground) => (
            <PlaygroundRow
              key={playground.id}
              playground={playground}
            />
          ))}
        </AnimateFade>
      )}
    </ContentResultsTransition>
  );
}
