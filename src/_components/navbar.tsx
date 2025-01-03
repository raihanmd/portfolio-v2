import Link from "next/link";

import ThemeToggler from "./ui/theme-toggler";
import { Button } from "./ui/button";

import { NAVBAR_MENU } from "~/constant/navbar";
import Each from "./each";

export default function Navbar() {
  return (
    <div className="fixed inset-0 bottom-auto z-[10] w-full border-b border-b-border bg-background/20 px-4 py-3 backdrop-blur-xl lg:px-0">
      <div className="container mx-auto flex w-full items-center justify-between">
        <div className="flex gap-5">
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
        <ThemeToggler />
      </div>
    </div>
  );
}
