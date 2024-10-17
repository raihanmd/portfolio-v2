"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Each from "../each";
import { ReactTyped } from "react-typed";
import { Skeleton } from "../ui/skeleton";
import { Window } from "./window";
import { useBoolean } from "usehooks-ts";
import { Spinner } from "../ui/spinner";

const WebsiteDevelopment = () => {
  const { value, setTrue, setFalse } = useBoolean(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (value) {
      timeout = setTimeout(() => {
        setFalse();
      }, 1500);
    }

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Window>
      <div className="relative flex size-full justify-center px-4 pt-4">
        <div className="flex w-full gap-2 pt-4">
          {/* Left column */}
          <div className="flex w-1/4 flex-col gap-2">
            <div className="aspect-square w-full rounded-full border border-border" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-1.5 w-2/3" />
            </div>
          </div>
          {/* Right column */}
          <div className="flex w-3/4 flex-col gap-1.5">
            <div className="flex w-full flex-col gap-1">
              <Skeleton className="flex h-2 w-full items-center justify-center">
                <ReactTyped
                  strings={[
                    "Web Development",
                    "SEO Optimization",
                    "Better UI/UX",
                  ]}
                  typeSpeed={80}
                  backSpeed={30}
                  backDelay={3000}
                  className="translate-y-[.5px] text-[5px] transition-none"
                  cursorChar="✨"
                  smartBackspace
                  onStringTyped={() => setTrue()}
                  loop
                />
              </Skeleton>
            </div>
            <AnimatePresence mode="wait">
              {value ? (
                <motion.div
                  key="spinner"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                    exit: { opacity: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex h-[78px] items-center justify-center"
                >
                  <Spinner className="text-primary/10" size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={{
                    hidden: {
                      opacity: 0,
                    },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.25,
                        type: "spring",
                        bounce: 0,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1"
                >
                  <Each
                    of={new Array(2).fill(null)}
                    render={(_, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { x: "5%", opacity: 0 },
                          visible: {
                            x: "0%",
                            opacity: 1,
                            transition: {
                              type: "tween",
                              ease: "easeOut",
                              duration: 0.3,
                            },
                          },
                          exit: {
                            opacity: 0,
                            transition: {
                              type: "tween",
                              ease: "easeIn",
                              duration: 0.2,
                            },
                          },
                        }}
                        className="grid grid-cols-2 gap-1"
                      >
                        <div className="aspect-video animate-shine rounded-md bg-gradient-to-r from-border via-border/75 to-border bg-[length:400%_100%]" />
                        <div className="flex flex-col justify-center gap-1">
                          <Skeleton className="h-1.5 w-full" />
                          <Skeleton className="h-1.5 w-2/3" />
                          <Skeleton className="h-1.5 w-4/5" />
                        </div>
                      </motion.div>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="absolute bottom-0 flex w-full items-center justify-between px-4 pb-2">
          <Skeleton className="h-1.5 w-1/3" />
          <div className="flex gap-1">
            <Each
              of={new Array(3).fill(null)}
              render={() => (
                <div className="size-2 rounded-full border border-border" />
              )}
            />
          </div>
        </div>
      </div>
    </Window>
  );
};

export default WebsiteDevelopment;
