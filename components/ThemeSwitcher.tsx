"use client";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher({
  variant = "default",
}: {
  variant?:
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size="icon-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="md:cursor-pointer size-10 md:size-12"
    >
      <Moon className="absolute transition-all duration-300 scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      <Sun className="absolute transition-all duration-300 scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
    </Button>
  );
}
