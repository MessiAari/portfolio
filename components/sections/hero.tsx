"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { assistant, profile } from "@/lib/portfolio-data";
import { openChat } from "@/components/chat-widget";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The hero stays pinned for the first part of the scroll; the name drifts up
  // and fades while the next section slides in over it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -160]);
  const restY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const [first, last] = profile.name.split(" ");

  return (
    <section id="home" ref={ref} className="relative h-[130svh]">
      <div className="sticky top-0 flex h-svh flex-col justify-end overflow-hidden px-4 pt-20 pb-24 sm:pb-20 md:px-6 md:pb-12">
        <motion.div style={{ opacity }} className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-border pb-3 font-mono text-[11px] tracking-[0.16em] text-muted uppercase"
          >
            <span>Portfolio · Computer Science</span>
            <span>{profile.university}</span>
          </motion.div>

          <motion.h1
            style={{ y: nameY }}
            className="mt-4 font-serif text-[clamp(4.5rem,min(19vw,24svh),13.5rem)] leading-[0.84] tracking-[-0.035em]"
          >
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease }}
              >
                {first}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block text-right italic md:pr-[8%]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.12, ease }}
              >
                {last}
              </motion.span>
            </span>
          </motion.h1>

          <motion.div
            style={{ y: restY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-6 grid gap-6 border-t border-border pt-5 md:mt-8 md:grid-cols-2 md:gap-10"
          >
            <p className="font-serif text-3xl leading-tight md:text-4xl">
              I&apos;m {profile.firstName}.{" "}
              <span className="relative inline-block">
                <FlipWords words={profile.taglines} className="text-accent italic" />
              </span>
            </p>
            <div>
              <TextGenerateEffect
                words={profile.heroLine}
                delay={0.8}
                filter={false}
                className="max-w-md text-base text-muted"
              />
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
                <a href="#projects" className="link">
                  See the projects ↓
                </a>
                <button type="button" onClick={openChat} className="link cursor-pointer">
                  Ask {assistant.name}, my AI assistant →
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
