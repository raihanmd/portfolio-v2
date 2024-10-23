"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { Folder, CakeSlice } from "lucide-react";
import { useAtom } from "jotai";

import { Window } from "./window";
import Each from "~/_components/each";
import {
  cookieCountAtom,
  cpsAtom,
  lastUpdateAtom,
} from "~/atom/game-development";
import { cn } from "~/lib/cn";
import { Skeleton } from "~/_components/ui/skeleton";

const GameDevelopment = () => {
  const [cookieCount, setCookieCount] = useAtom(cookieCountAtom);
  const [cps, setCps] = useAtom(cpsAtom);
  const [lastUpdate, setLastUpdate] = useAtom(lastUpdateAtom);
  const cakeRef = useRef<ElementRef<typeof CakeSlice>>(null);
  const clickTimeRef = useRef<number[]>([]);
  const cpsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLastUpdate(now);
    }, 100);

    return () => clearInterval(interval);
  }, [cps, setCookieCount, lastUpdate, setLastUpdate]);

  useEffect(() => {
    cpsIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const recentClicks = clickTimeRef.current.filter(
        (time) => now - time < 1000,
      );
      clickTimeRef.current = recentClicks;
      setCps(recentClicks.length);
    }, 1000);

    return () => {
      if (cpsIntervalRef.current) {
        clearInterval(cpsIntervalRef.current);
      }
    };
  }, [setCps]);

  const handleClick = () => {
    setCookieCount((prev) => prev + 1);
    clickTimeRef.current.push(Date.now());
  };

  return (
    <Window>
      <div className="grid size-full grid-cols-4 pt-4">
        <div className="col-span-1 flex flex-wrap content-start gap-y-[3px] border-r border-border p-1 text-muted-foreground">
          <Each
            of={new Array(4).fill(null)}
            render={() => (
              <>
                <div className="flex w-full gap-x-[2px]">
                  <Skeleton className="h-1 w-[30%]" />
                  <Skeleton className="h-1 w-[25%]" />
                  <Skeleton className="h-1 w-[45%]" />
                </div>

                <div className="flex w-full gap-x-[2px]">
                  <Skeleton className="h-1 w-[10%]" />
                  <Skeleton className="h-1 w-[75%]" />
                  <Skeleton className="h-1 w-[15%]" />
                </div>

                <div className="flex w-full gap-x-[2px]">
                  <Skeleton className="h-1 w-[50%]" />
                  <Skeleton className="h-1 w-[10%]" />
                  <Skeleton className="h-1 w-[40%]" />
                </div>
              </>
            )}
          />
        </div>
        <div className="col-span-2 grid grid-rows-3">
          {/* Main Game Screen */}
          <div className="relative row-span-2 flex flex-col items-center justify-start text-muted-foreground">
            <div className="flex flex-col items-center py-1">
              <p className="text-[8px]">Score: {Math.floor(cookieCount)}</p>
              <p className="text-[4px]">CPS: {cps.toFixed(1)}</p>
            </div>
            <div className="flex size-full items-center justify-center">
              <CakeSlice
                ref={cakeRef}
                size={40}
                className={cn(
                  "cursor-pointer text-muted-foreground transition-all hover:scale-110 active:scale-90",
                )}
                onClick={handleClick}
              />
            </div>
          </div>
          <div className="row-span-1 space-y-0.5 border-t border-border p-1 text-muted-foreground">
            <Skeleton className="h-0.5 w-5" />
            <div className="flex gap-1">
              <Each
                of={new Array(5).fill(null)}
                render={() => (
                  <div className="flex flex-col items-center justify-center rounded-full">
                    <Folder size={12} className="fill-border text-border" />
                    <Skeleton className="h-0.5 w-[80%]" />
                  </div>
                )}
              />
              <div className="flex flex-col items-center justify-center rounded-full">
                <Folder size={12} className="text-border" />
                <Skeleton className="h-0.5 w-[80%]" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 border-l border-border p-1 text-muted-foreground">
          <div className="space-y-0.5">
            <Skeleton className="aspect-video rounded-sm" />
            <div className="flex justify-between gap-0.5">
              <Skeleton className="h-1 w-6 rounded-full" />
              <Skeleton className="h-1 w-16" />
            </div>
            <div className="space-y-0.5">
              <Skeleton className="h-1 w-full" />
              <Skeleton className="h-1 w-3/5" />
            </div>
            <div className="flex space-x-0.5">
              <Skeleton className="aspect-square w-[50%] rounded-sm" />
              <Skeleton className="aspect-square w-[50%] rounded-sm" />
            </div>
            <div className="flex w-full gap-0.5">
              <Skeleton className="h-1 w-[50%]" />
              <Skeleton className="h-1 w-[15%]" />
              <Skeleton className="h-1 w-[35%]" />
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default GameDevelopment;
