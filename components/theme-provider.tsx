"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { themeColors } from "@/lib/theme-colors";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/*
 * THEME TOGGLE — how it works:
 * 1. Before the page paints, an inline script in app/layout.tsx reads
 *    localStorage("theme"); if nothing is saved it uses the OS setting
 *    (prefers-color-scheme). It adds/removes the `dark` class on <html>.
 * 2. Tailwind's `dark:` styles and our CSS variables switch on that class.
 * 3. toggleTheme() plays the "bit wave" (tiles sweep across the screen showing
 *    the new state, 0 = light, 1 = dark), flips the class while the screen is
 *    covered, and saves the choice in localStorage for the next visit.
 */
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// The server can't know the theme; dark is the site's default look.
function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [wave, setWave] = useState<{ id: number; to: Theme } | null>(null);

  const toggleTheme = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyTheme(next);
      return;
    }
    // Ignore extra clicks while a switch is already playing.
    setWave((current) => current ?? { id: Date.now(), to: next });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <AnimatePresence>
        {wave && (
          <BitWave
            key={wave.id}
            to={wave.to}
            onCovered={() => applyTheme(wave.to)}
            onDone={() => setWave(null)}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */

const CELL_DURATION = 0.22; // seconds for one tile to flip in or out
const SPREAD = 0.42; // seconds between the first and last tile

/**
 * The mode-switch animation: a grid of tiles ripples out from the toggle
 * (top-right), each tile showing the new bit. When the screen is covered the
 * theme flips underneath, then the tiles clear in the same order.
 */
function BitWave({ to, onCovered, onDone }: { to: Theme; onCovered: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<"cover" | "reveal">("cover");
  const [grid] = useState(() => {
    const size = window.innerWidth < 640 ? 52 : 72;
    const cols = Math.ceil(window.innerWidth / size);
    const rows = Math.ceil(window.innerHeight / size);
    const maxDist = Math.hypot(cols, rows);
    const cells = Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      // distance from the top-right corner, where the toggle lives
      const dist = Math.hypot(cols - 1 - col, row) / maxDist;
      return { delay: dist * SPREAD + Math.random() * 0.05 };
    });
    return { size, cols, cells };
  });

  // Keep the latest callbacks without restarting the timers on every render.
  const callbacks = useRef({ onCovered, onDone });
  useEffect(() => {
    callbacks.current = { onCovered, onDone };
  });

  useEffect(() => {
    const total = (SPREAD + CELL_DURATION + 0.06) * 1000;
    const t = setTimeout(() => {
      if (phase === "cover") {
        callbacks.current.onCovered();
        setPhase("reveal");
      } else {
        callbacks.current.onDone();
      }
    }, total);
    return () => clearTimeout(t);
  }, [phase]);

  const colors = themeColors[to];
  const bit = to === "dark" ? "1" : "0";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9500] grid"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, ${grid.size}px)`, gridAutoRows: `${grid.size}px` }}
    >
      {grid.cells.map((cell, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={phase === "cover" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
          transition={{ delay: cell.delay, duration: CELL_DURATION, ease: "easeOut" }}
          style={{ backgroundColor: colors.background, color: colors.accent }}
          className="flex items-center justify-center font-mono text-lg"
        >
          {bit}
        </motion.div>
      ))}
    </div>
  );
}
