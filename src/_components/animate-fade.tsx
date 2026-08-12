"use client";
import { motion, HTMLMotionProps, type Variants } from "motion/react";

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
};

function AnimateFade({
  children,
  staggerChildren = 0,
  delayChildren = 0,
  fadeContainer = true,
  ...props
}: Props) {
  const containerVariants: Variants = {
    hidden: fadeContainer ? { opacity: 0, filter: "blur(5px)" } : {},
    visible: {
      ...(fadeContainer ? { opacity: 1, filter: "blur(0px)" } : {}),
      transition: {
        when: "beforeChildren",
        staggerChildren: staggerChildren > 0 ? staggerChildren : 0,
        delayChildren: delayChildren > 0 ? delayChildren : 0,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default AnimateFade;
