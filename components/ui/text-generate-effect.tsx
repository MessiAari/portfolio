"use client";
// Aceternity UI — Text Generate Effect (https://ui.aceternity.com/components/text-generate-effect)
// Adapted: theme colours come from the parent, runs once on mount, respects reduced motion.
import { useEffect } from "react";
import { motion, stagger, useAnimate, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  delay?: number;
}) => {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (reduceMotion) return;
    animate(
      "span",
      { opacity: 1, filter: filter ? "blur(0px)" : "none" },
      { duration, delay: stagger(0.06, { startDelay: delay }) },
    );
  }, [animate, duration, filter, delay, reduceMotion]);

  if (reduceMotion) return <p className={className}>{words}</p>;

  return (
    <motion.p ref={scope} className={cn(className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="opacity-0"
          style={{ filter: filter ? "blur(10px)" : "none" }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
};
