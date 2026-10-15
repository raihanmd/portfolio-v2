"use client";

import { useEffect } from "react";
import { useBoolean, useWindowSize } from "usehooks-ts";
import dynamic from "next/dynamic";

const DynamicLanyard = dynamic(() => import("./index"), {
  ssr: false,
});

const CARD_HEIGHT = 430;
const CARD_TOP = 256;
// React Bits portrait geometry is 1.6 by 2.25 world units.
const CARD_WIDTH = (CARD_HEIGHT * 1.6) / 2.25;

export default function EventBadgeContainer() {
  const { width = 0 } = useWindowSize();
  const { value: isXl, setTrue, setFalse } = useBoolean(false);

  useEffect(() => {
    if (width >= 1280) {
      setTrue();
    } else {
      setFalse();
    }
  }, [width, setTrue, setFalse]);

  if (!isXl) return null;

  // Preserve the old left-side placement while keeping the card inside 1280px.
  const anchorX = Math.max(
    -2.75,
    ((CARD_WIDTH / 2 + 8 - width / 2) * 2.25) / CARD_HEIGHT,
  );

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full">
      <DynamicLanyard
        className="pointer-events-auto"
        frontImage="/images/lanyard-front.jpg"
        backImage="/images/lanyard-back.jpg"
        imageFit="contain"
        cardColor="black"
        finish="glossy"
        anchorX={anchorX}
        cardHeightPx={CARD_HEIGHT}
        cardTopPx={CARD_TOP}
        strapImage="/images/band-rope.png"
        strapColor="black"
        strapWidth={0.65}
        gravity={0.7}
        damping={0.7}
        elasticity={0.35}
        breeze={0}
        intro={false}
      />
    </div>
  );
}
