"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { bitMask } from "@/lib/binary";

/**
 * Text that starts as 0s and 1s and "decodes" into the real characters,
 * left to right with a little randomness. Runs on mount or when scrolled into view.
 * Best with a monospace font so the width never jumps.
 */
export function DecodeText({
  text,
  className,
  delay = 0,
  duration = 1.2,
  trigger = "mount",
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  trigger?: "mount" | "inView";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(() => bitMask(text));
  const start = trigger === "mount" || inView;

  useEffect(() => {
    if (!start) return;
    const chars = Array.from(text);
    // Each character settles at its own moment: roughly left to right.
    const settleAt = chars.map((_, i) => (reduce ? 0 : (i / chars.length) * duration * 0.75 + Math.random() * duration * 0.25));
    const t0 = performance.now() + (reduce ? 0 : delay * 1000);
    let frame = 0;
    let raf = 0;

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      frame++;
      if (t >= 0 && frame % 2 === 0) {
        let done = true;
        const out = chars
          .map((c, i) => {
            if (c === " " || t >= settleAt[i]) return c;
            done = false;
            return Math.random() < 0.5 ? "0" : "1";
          })
          .join("");
        setDisplay(out);
        if (done) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text, delay, duration, reduce]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
