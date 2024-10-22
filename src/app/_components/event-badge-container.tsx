"use client";

import { useEffect } from "react";
import { useBoolean, useWindowSize } from "usehooks-ts";
import dynamic from "next/dynamic";

const DynamicEventBadge = dynamic(() => import("./event-badge"), {
  ssr: false,
});

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

  return <DynamicEventBadge />;
}
