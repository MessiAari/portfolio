"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  IconBrain,
  IconCode,
  IconCreditCard,
  IconDatabase,
  IconFlask,
  IconLayersSubtract,
  IconTool,
} from "@tabler/icons-react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionHeading } from "@/components/section-heading";
import { skills } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const icons: Record<string, typeof IconCode> = {
  Languages: IconCode,
  Frameworks: IconLayersSubtract,
  "Backend & data": IconDatabase,
  AI: IconBrain,
  Payments: IconCreditCard,
  Tools: IconTool,
  Practices: IconFlask,
};

const allSkills = skills.flatMap((group) => group.items);
const half = Math.ceil(allSkills.length / 2);

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The two marquee rows also drift in opposite directions as you scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rowA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  const rowB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-80, 80]);

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden px-5 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="02 — Skills"
          title="What I build with"
          description="From the languages I learned first to the AI tools I now direct every day."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => {
            const Icon = icons[group.category] ?? IconCode;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-colors hover:border-accent/40",
                  group.category === "AI" && "lg:col-span-2",
                  group.category === "Practices" && "sm:col-span-2",
                )}
              >
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100 md:opacity-0"
                />
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 text-lg font-semibold">{group.category}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-accent/50 hover:text-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div aria-hidden className="mt-20 space-y-3">
        <motion.div style={{ x: rowA }}>
          <InfiniteMovingCards items={allSkills.slice(0, half)} direction="left" speed="slow" />
        </motion.div>
        <motion.div style={{ x: rowB }}>
          <InfiniteMovingCards items={allSkills.slice(half)} direction="right" speed="slow" />
        </motion.div>
      </div>
    </section>
  );
}
