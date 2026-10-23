"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { DecodeText } from "@/components/ui/decode-text";
import { BinaryHeading } from "@/components/binary-heading";
import { skills } from "@/lib/portfolio-data";
import { bin } from "@/lib/binary";
import { cn } from "@/lib/utils";

const allSkills = skills.flatMap((group) => group.items);
const half = Math.ceil(allSkills.length / 2);
const BITS = 8; // each skill group is drawn as an 8-bit register

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The two ticker rows drift in opposite directions as you scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rowA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [140, -140]);
  const rowB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-140, 140]);

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <BinaryHeading
          index={2}
          title="Skills"
          description={`${allSkills.length} skills in ${skills.length} groups, from the languages I started with to the AI tools I direct every day.`}
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:ml-[220px] lg:grid-cols-2 xl:grid-cols-3">
          {skills.map((group, i) => (
            <Register key={group.category} category={group.category} items={group.items} order={i} />
          ))}
        </div>
      </div>

      <div aria-hidden className="mt-24 space-y-2 md:mt-32">
        <motion.div style={{ x: rowA }}>
          <InfiniteMovingCards
            items={allSkills.slice(0, half)}
            direction="left"
            speed="slow"
            separator="0"
            itemClassName="font-mono text-4xl font-bold tracking-[-0.04em] md:text-6xl"
          />
        </motion.div>
        <motion.div style={{ x: rowB }}>
          <InfiniteMovingCards
            items={allSkills.slice(half)}
            direction="right"
            speed="slow"
            separator="1"
            itemClassName="font-mono text-4xl font-bold tracking-[-0.04em] text-foreground/30 md:text-6xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

/** One skill group: its name, a row of bits that light up to its size, and the skills. */
function Register({ category, items, order }: { category: string; items: string[]; order: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (order % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-accent/50"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-lg font-semibold tracking-tight">
          <DecodeText text={category} trigger="inView" duration={0.8} />
        </h3>
        <p className="font-mono text-xs text-muted" title={`${items.length} skills`}>
          <span className="text-accent">{bin(items.length)}</span> = {items.length}
        </p>
      </div>

      {/* the register: one bit per skill switches on */}
      <div aria-hidden className="mt-3 flex gap-1">
        {Array.from({ length: BITS }, (_, b) => {
          const on = b < items.length;
          return (
            <motion.span
              key={b}
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + b * 0.06, duration: 0.3 }}
              className={cn(
                "flex h-6 flex-1 items-center justify-center rounded-[4px] font-mono text-[11px]",
                on ? "bg-accent text-background" : "bg-foreground/[0.06] text-muted",
              )}
            >
              {on ? 1 : 0}
            </motion.span>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-foreground/[0.06] px-2 py-1 text-[13px] text-foreground/85">
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
