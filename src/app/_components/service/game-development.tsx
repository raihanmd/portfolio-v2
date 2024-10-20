"use client";

import { type ElementRef, useEffect, useRef } from "react";
import { Folder, CakeSlice } from "lucide-react";
import { useAtom } from "jotai";

import { Window } from "./window";
import Each from "../each";
import {
  cookieCountAtom,
  cpsAtom,
  lastUpdateAtom,
} from "~/atom/game-development";
import { cn } from "~/lib/cn";

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
        <div className="col-span-1 border-r border-border p-1 text-muted-foreground">
          <p className="text-[5px] font-bold">Hierarchy</p>
          <div className="pl-1 text-[4px]">
            <p>▶ Main Scene</p>
            <p>▶ Cake</p>
            <p>▶ UI</p>
          </div>
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
            <p className="foreground text-[4px]">Assets</p>
            <div className="flex gap-1">
              <Each
                of={["Scenes", "Prefabs", "Materials", "Textures"]}
                render={(label) => (
                  <div className="flex flex-col items-center justify-center rounded-full">
                    <Folder size={12} className="fill-border text-border" />
                    <p className="text-[2.5px]">{label}</p>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className="col-span-1 border-l border-border p-1 text-muted-foreground">
          <p className="text-[5px] font-bold">Inspector</p>
        </div>
      </div>
    </Window>
  );
};

export default GameDevelopment;
