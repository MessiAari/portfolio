"use client";
// Aceternity UI — Card Spotlight (https://ui.aceternity.com/components/card-spotlight)
// Adapted: the WebGL dot-matrix layer is replaced by a light CSS gradient so the
// cards stay fast on phones; the cursor-following spotlight mask is unchanged.
import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React, { MouseEvent as ReactMouseEvent } from "react";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  className,
  ...props
}: {
  radius?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, white, transparent 80%)`;

  return (
    <div
      className={cn("group/spotlight relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px z-0 opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          background:
            "color-mix(in oklab, var(--accent) 9%, transparent)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
