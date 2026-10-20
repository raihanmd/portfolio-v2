"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "~/_components/ui/button";
import { NAVBAR_MENU } from "~/constant/navbar";
import NavbarBrand from "./brand";

/**
 * Full-screen mobile navigation.
 *
 * The overlay slides down from the top edge and its items stagger in behind it,
 * following the reference implementation in the chained-ip project. The stagger
 * is deliberately slow so each link's own animation stays readable instead of
 * the whole list resolving at once.
 *
 * Motion primitives stay in this shared kit so features never reach for a raw
 * `motion.div`.
 */
const overlayVariants: Variants = {
  hidden: {
    y: "-100%",
    transition: { delay: 0.05, duration: 0.35, ease: [0.74, 0, 0.19, 1.02] },
  },
  visible: {
    y: 0,
    transition: { delay: 0.2, duration: 0.5, ease: [0.74, 0, 0.19, 1.02] },
  },
};

const listVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: { staggerChildren: 0.08 },
  },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.45, staggerChildren: 0.14 },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.3, type: "spring", stiffness: 200, damping: 20 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, type: "spring", stiffness: 200, damping: 20 },
  },
};

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <NavbarBrand />
            <Button
              ref={triggerRef}
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
          </div>

          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-1 flex-col justify-center gap-2 px-6 py-10"
          >
            {NAVBAR_MENU.map((item) => (
              <motion.div key={item.href} variants={itemVariants}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-2xl font-semibold tracking-tight text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-3xl"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
