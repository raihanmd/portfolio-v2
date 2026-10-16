"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, type ReactNode, useContext, useRef } from "react";

const BlogResultsMotionContext = createContext(false);

export function useBlogResultsMotion(): boolean {
  return useContext(BlogResultsMotionContext);
}

export default function BlogResultsTransition({
  children,
  transitionKey,
}: {
  children: ReactNode;
  transitionKey: string;
}) {
  const initialKey = useRef(transitionKey);
  const animateResults = transitionKey !== initialKey.current;

  return (
    <BlogResultsMotionContext.Provider value={animateResults}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.18, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.12, ease: "easeOut" },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </BlogResultsMotionContext.Provider>
  );
}
