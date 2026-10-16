"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface ContentResultsTransitionProps {
  transitionKey: string;
  deferUntilMounted?: boolean;
  skipInitialAnimation?: boolean;
  className?: string;
  children: ReactNode;
}

export default function ContentResultsTransition({
  transitionKey,
  deferUntilMounted = false,
  skipInitialAnimation = false,
  className,
  children,
}: ContentResultsTransitionProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [painted, setPainted] = useState(false);

  useEffect(() => {
    if (!deferUntilMounted) return;
    setPainted(false);
  }, [deferUntilMounted, transitionKey]);

  useEffect(() => {
    if (!deferUntilMounted || painted) return;
    const node = hostRef.current;
    if (!node) {
      setPainted(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setPainted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPainted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [deferUntilMounted, painted, transitionKey]);

  const holdHidden = deferUntilMounted && !painted;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        ref={hostRef}
        key={transitionKey}
        initial={skipInitialAnimation ? false : { opacity: 0 }}
        animate={
          holdHidden
            ? { opacity: 0 }
            : {
                opacity: 1,
                transition: { duration: 0.18, ease: "easeOut" },
              }
        }
        exit={{
          opacity: 0,
          transition: { duration: 0.12, ease: "easeOut" },
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
