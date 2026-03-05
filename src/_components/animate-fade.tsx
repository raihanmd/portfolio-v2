"use client";
import { motion, HTMLMotionProps, type Variants } from "motion/react";

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
};

function AnimateFade({
  children,
  staggerChildren = 0,
  delayChildren = 0,
  ...props
}: Props) {
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
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
