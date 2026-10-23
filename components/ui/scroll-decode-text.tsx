"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { bitMask } from "@/lib/binary";
import { cn } from "@/lib/utils";

/**
 * A paragraph that is "encoded" until you read it: every word starts as 0s and
 * 1s and decodes into the real word as the paragraph scrolls through the screen.
 */
export function ScrollDecodeText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const [revealed, setRevealed] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.round(p * words.length);
    if (next !== revealed) setRevealed(next);
  });

  const shown = reduce ? words.length : revealed;

  return (
    <p ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "transition-colors duration-300",
            i < shown ? "text-foreground" : "font-mono text-[0.8em] text-foreground/25",
          )}
        >
          {i < shown ? word : bitMask(word)}{" "}
        </span>
      ))}
    </p>
  );
}
