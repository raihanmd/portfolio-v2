"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "~/_components/ui/button";
import { NAVBAR_MENU } from "~/constant/navbar";
import Each from "../each";
import ThemeToggler from "../ui/theme-toggler";
import NavbarBrand from "./brand";
import MobileMenu from "./mobile-menu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <>
      <div className="fixed inset-0 bottom-auto z-[10] w-full border-b border-b-border bg-background/20 px-4 py-3 backdrop-blur-xl lg:px-0">
        <div className="container mx-auto flex w-full items-center justify-between">
          <div className="flex items-center gap-5 lg:gap-8">
            <NavbarBrand className="lg:hidden" />
            <div className="hidden gap-3 sm:gap-5 lg:flex">
              <Each
                of={NAVBAR_MENU}
                render={(item) => (
                  <Button
                    key={item.label}
                    variant={"linkHover2"}
                    asChild
                    className="p-0 after:w-full"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggler />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
