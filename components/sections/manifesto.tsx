"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollAssembleText } from "@/components/ui/scroll-assemble-text";
import { profile } from "@/lib/portfolio-data";

/**
 * A pinned interlude between the hero and About: the three verbs from Aari's
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
    <section ref={ref} aria-label="How I work" className="relative h-[260svh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-5">
        <h2 className="flex flex-col items-center text-center text-6xl leading-[0.9] font-semibold tracking-tighter uppercase sm:text-8xl md:text-9xl">
          {profile.manifesto.map((word, i) => (
            <ScrollAssembleText
              key={word}
              text={`${word}.`}
              progress={scrollYProgress}
              range={ranges[i]}
              reduceMotion={reduce}
              className={i === 2 ? "text-accent" : undefined}
            />
          ))}
        </h2>
        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="mt-10 max-w-md text-center font-serif text-xl text-muted italic md:text-2xl"
        >
          I decide what to build, direct the work, and ship it.
        </motion.p>
      </div>
    </section>
  );
}
