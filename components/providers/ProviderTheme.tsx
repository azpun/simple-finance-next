"use client";
import { ThemeProvider } from "next-themes";

export function ProviderTheme({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      {children}
    </ThemeProvider>
  );
}
