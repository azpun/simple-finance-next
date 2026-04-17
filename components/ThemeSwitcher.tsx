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
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon />}
    </Button>
  );
}
