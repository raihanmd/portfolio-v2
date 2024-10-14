"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";

export default function RootProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
