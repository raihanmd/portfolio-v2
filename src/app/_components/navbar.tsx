import Link from "next/link";

import ThemeToggler from "./ui/theme-toggler";
import { Button } from "./ui/button";

import { NAVBAR_MENU } from "~/constant/navbar";

export default function Navbar() {
  return (
    <div className="fixed inset-0 bottom-auto z-[10] mx-auto flex items-center justify-center gap-5 bg-transparent py-5 text-center">
      {NAVBAR_MENU.map((item) => (
        <Button key={item.label} variant={"linkHover2"} asChild>
          <Link href={item.href}>{item.label}</Link>
        </Button>
      ))}
      <ThemeToggler />
    </div>
  );
}
