"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SectionHeading } from "@/components/section-heading";
import { skills } from "@/lib/portfolio-data";

const allSkills = skills.flatMap((group) => group.items);
const half = Math.ceil(allSkills.length / 2);

export function Skills() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // The two ticker rows also drift in opposite directions as you scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rowA = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [120, -120]);
  const rowB = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-120, 120]);

  return (
    <section id="skills" ref={ref} className="relative overflow-hidden px-4 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="02"
          label="Skills"
          title="What I build with"
          description="From the languages I started with to the AI tools I now direct every day."
        />

        <ul className="mt-14 border-b border-border md:ml-[232px]">
          {skills.map((group, i) => (
            <motion.li
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group grid gap-2 border-t border-border py-5 sm:grid-cols-[48px_200px_1fr] sm:items-baseline sm:gap-4"
            >
              <span className="hidden font-mono text-[11px] text-muted sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-2xl transition-colors group-hover:text-accent md:text-3xl">
                {group.category}
              </h3>
              <p className="text-[15px] leading-relaxed text-foreground/80">
                {group.items.map((item, j) => (
                  <span key={item}>
                    {item}
                    {j < group.items.length - 1 && (
                      <>
                        {" "}
                        <span className="mx-1 text-foreground/25">/</span>{" "}
                      </>
                    )}
                  </span>
                ))}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      <div aria-hidden className="mt-24 space-y-2 md:mt-32">
        <motion.div style={{ x: rowA }}>
          <InfiniteMovingCards
            items={allSkills.slice(0, half)}
            direction="left"
            speed="slow"
            itemClassName="font-serif text-5xl md:text-7xl"
          />
        </motion.div>
        <motion.div style={{ x: rowB }}>
          <InfiniteMovingCards
            items={allSkills.slice(half)}
            direction="right"
            speed="slow"
            itemClassName="font-serif text-5xl italic text-muted md:text-7xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
