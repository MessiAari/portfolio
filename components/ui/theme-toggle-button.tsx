"use client";

import { motion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/** A binary switch: 0 = light, 1 = dark. The knob slides to the active bit. */
export const ThemeToggleButton = ({ className = "" }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      aria-label={isDark ? "Dark mode (1). Switch to light mode (0)" : "Light mode (0). Switch to dark mode (1)"}
      title={isDark ? "Mode 1 · dark" : "Mode 0 · light"}
      className={cn(
        "relative flex h-8 w-[3.75rem] items-center rounded-full border border-foreground/25 font-mono text-[13px] transition-colors hover:border-accent",
        className,
      )}
    >
      <span className="flex w-1/2 justify-center text-muted">0</span>
      <span className="flex w-1/2 justify-center text-muted">1</span>
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: isDark ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 bottom-0.5 left-0.5 flex w-[calc(50%-2px)] items-center justify-center rounded-full bg-foreground text-background"
      >
        {isDark ? "1" : "0"}
      </motion.span>
    </button>
  );
};
