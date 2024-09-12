"use client";

import { ParentComponent } from "../types";
import { ThemeProvider } from "./theme-provider";

export default function RootProvider({ children }: ParentComponent) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
