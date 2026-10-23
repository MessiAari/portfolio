"use client";

import { motion } from "motion/react";
import { DecodeText } from "@/components/ui/decode-text";
import { bin } from "@/lib/binary";
import { cn } from "@/lib/utils";

/**
 * Section header: the section number in binary (with its decimal value),
 * and a monospace title that decodes from 0s and 1s when it scrolls into view.
 */
export function BinaryHeading({
  index,
  title,
  description,
  className,
}: {
  index: number;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 border-t border-foreground/80 pt-6 md:grid-cols-[180px_1fr] md:gap-10", className)}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="font-mono"
      >
        <span className="text-4xl font-semibold tracking-tight text-accent md:text-5xl">{bin(index)}</span>
        <span className="ml-2 align-top text-xs text-muted">= {index}</span>
      </motion.p>
      <div>
        <h2 className="font-mono text-4xl font-bold tracking-[-0.05em] sm:text-5xl md:text-6xl">
          <DecodeText text={title} trigger="inView" duration={1} />
        </h2>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-lg text-base text-pretty text-muted md:text-lg"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
