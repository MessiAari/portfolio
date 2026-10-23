"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollAssembleText } from "@/components/ui/scroll-assemble-text";
import { profile } from "@/lib/portfolio-data";
import { bin } from "@/lib/binary";
import { cn } from "@/lib/utils";

/**
 * A pinned interlude between the hero and About: the three verbs from Aaritra's
 * intro assemble letter by letter, one after another, as you scroll.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const captionOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.75, 0.88], reduce ? [0, 0] : [20, 0]);

  const ranges: [number, number][] = [
    [0, 0.3],
    [0.25, 0.55],
    [0.5, 0.8],
  ];

  return (
    <section ref={ref} aria-label="How I work" className="relative h-[220svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5">
        <h2 className="flex flex-col items-start gap-1">
          {profile.manifesto.map((word, i) => (
            <span key={word} className="flex items-baseline gap-3 md:gap-5">
              {/* step number in binary: 01, 10, 11 */}
              <span className="w-8 font-mono text-sm text-muted md:w-12 md:text-lg">{bin(i + 1).padStart(2, "0")}</span>
              <ScrollAssembleText
                text={`${word}.`}
                progress={scrollYProgress}
                range={ranges[i]}
                reduceMotion={reduce}
                className={cn(
                  "font-mono text-[clamp(3.2rem,13vw,9rem)] leading-[0.95] font-bold tracking-[-0.06em]",
                  i === 2 && "text-accent",
                )}
              />
            </span>
          ))}
        </h2>
        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="mt-10 max-w-md text-center font-mono text-sm text-muted md:text-base"
        >
          {"// I decide what to build, direct the work, and ship it."}
        </motion.p>
      </div>
    </section>
  );
}
