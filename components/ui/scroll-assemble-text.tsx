"use client";
// Skiper UI — Text Scroll animation (skiper31, https://skiper-ui.com)
// Letters start spread out and tilted, then assemble into the word as you scroll.
// Adapted: takes a MotionValue from the parent section and supports reduced motion.
import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const Character = ({
  char,
  index,
  centerIndex,
  progress,
  range,
}: {
  char: string;
  index: number;
  centerIndex: number;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const distanceFromCenter = index - centerIndex;
  const x = useTransform(progress, range, [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(progress, range, [distanceFromCenter * 50, 0]);
  const opacity = useTransform(progress, range, [0.3, 1]);

  return (
    <motion.span
      className={cn("inline-block", char === " " && "w-[0.3em]")}
      style={{ x, rotateX, opacity }}
    >
      {char}
    </motion.span>
  );
};

export const ScrollAssembleText = ({
  text,
  progress,
  range = [0, 0.5],
  reduceMotion,
  className,
}: {
  text: string;
  progress: MotionValue<number>;
  range?: [number, number];
  reduceMotion?: boolean | null;
  className?: string;
}) => {
  if (reduceMotion) return <span className={className}>{text}</span>;

  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <span className={cn("inline-block", className)} style={{ perspective: "500px" }} aria-label={text}>
      {characters.map((char, index) => (
        <Character
          key={index}
          char={char}
          index={index}
          centerIndex={centerIndex}
          progress={progress}
          range={range}
        />
      ))}
    </span>
  );
};
