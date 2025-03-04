"use client";

import { motion, HTMLMotionProps, type Variants } from "framer-motion";

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
};

function AnimateItem({ children, ...props }: Props) {
  const itemVariants: Variants = {
    hidden: { x: 30, opacity: 0, filter: "blur(5px)" },
    visible: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} {...props}>
      {children}
    </motion.div>
  );
}

export default AnimateItem;
