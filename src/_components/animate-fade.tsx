"use client";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  /**
   * When false the container itself never fades — only its children stagger
   * in. Use for content that swaps in after a skeleton/loader so there is no
   * blank gap between the two states.
   */
  fadeContainer?: boolean;
  /**
   * Starts the visible variant after the first browser paint. Use for streamed
   * content whose client tree can hydrate before its Suspense replacement is
   * painted, otherwise its entrance may finish before the user sees it.
   */
  deferUntilMounted?: boolean;
  skipInitialAnimation?: boolean;
};

function AnimateFade({
  children,
  staggerChildren = 0,
  delayChildren = 0,
  fadeContainer = true,
  deferUntilMounted = false,
  skipInitialAnimation = false,
  ...props
}: Props) {
  const [canAnimate, setCanAnimate] = useState(
    skipInitialAnimation || !deferUntilMounted,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!deferUntilMounted) return;
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setCanAnimate(true);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      frame = requestAnimationFrame(() => setCanAnimate(true));
      observer.disconnect();
    });
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [deferUntilMounted]);

  const containerVariants: Variants = {
    hidden: fadeContainer ? { opacity: 0, filter: "blur(5px)" } : {},
    visible: {
      ...(fadeContainer ? { opacity: 1, filter: "blur(0px)" } : {}),
      transition: {
        staggerChildren: staggerChildren > 0 ? staggerChildren : 0,
        delayChildren: delayChildren > 0 ? delayChildren : 0,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      initial={skipInitialAnimation ? false : "hidden"}
      animate={canAnimate ? "visible" : "hidden"}
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default AnimateFade;
