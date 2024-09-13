import Link from "next/link";

import ThemeToggler from "./ui/theme-toggler";
import { Button } from "./ui/button";

import { NAVBAR_MENU } from "~/constant/navbar";

export default function Navbar() {
  return (
    <div className="fixed inset-0 bottom-auto z-[10] w-full border-b border-b-border bg-background/20 py-3 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
        <div className="flex gap-5">
          {NAVBAR_MENU.map((item) => (
            <Button
              key={item.label}
              variant={"linkHover2"}
              asChild
              className="p-0 after:w-full"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
        <ThemeToggler />
      </div>
    </div>
  );
}
