"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Editorial section header: a ruled line, a small index label and a big serif title. */
export function SectionHeading({
  index,
  label,
  title,
  description,
  className,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 border-t border-foreground/80 pt-5 md:grid-cols-[200px_1fr] md:gap-8", className)}>
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
        {index} <span className="mx-1 text-foreground/30">/</span> {label}
      </p>
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-5xl leading-[0.95] tracking-[-0.02em] text-balance sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-lg text-base text-pretty text-muted md:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
