"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  motionStyle?: "fade" | "slide";
};

function AnimateItem({ children, motionStyle = "slide", ...props }: Props) {
  const itemVariants: Variants = {
    hidden: {
      ...(motionStyle === "slide" ? { x: 30 } : {}),
      opacity: 0,
      filter: "blur(5px)",
    },
    visible: {
      ...(motionStyle === "slide" ? { x: 0 } : {}),
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ type: "spring", damping: 12, stiffness: 100 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default AnimateItem;
