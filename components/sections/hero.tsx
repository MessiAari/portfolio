"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { IconArrowDown, IconMessageCircle } from "@tabler/icons-react";
import { Spotlight } from "@/components/ui/spotlight-new";
import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { profile } from "@/lib/portfolio-data";
import { openChat } from "@/components/chat-widget";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // The hero is pinned while you scroll the first ~half screen; the content
  // shrinks, lifts and fades so the next section slides in over it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.82]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "30%"]);

  return (
    <section id="home" ref={ref} className="relative h-[130svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <motion.div
          aria-hidden
          style={{ y: gridY }}
          className="bg-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        />
        <div aria-hidden className="absolute inset-0 hidden dark:block">
          <Spotlight />
        </div>
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        />

        <motion.div
          style={{ scale, y, opacity }}
          className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex md:mb-8 items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted backdrop-blur sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            B.Tech CSE · {profile.university}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-gradient text-5xl leading-[0.95] font-semibold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 flex min-h-[3.5rem] flex-col items-center justify-center gap-x-3 font-serif text-3xl text-foreground sm:flex-row sm:text-4xl md:text-5xl"
          >
            <span className="text-muted italic">Hi, I&apos;m {profile.nickname}.</span>
            <span className="relative inline-block">
              <FlipWords words={profile.taglines} className="text-accent italic" />
            </span>
          </motion.div>

          <TextGenerateEffect
            words={profile.heroLine}
            delay={0.6}
            className="mx-auto mt-6 max-w-xl text-base text-muted md:text-lg"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-10"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              See my projects
            </a>
            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:bg-foreground/5"
            >
              <IconMessageCircle className="h-4 w-4" /> Ask my AI assistant
            </button>
          </motion.div>
        </motion.div>

        <motion.a
          href="#about"
          style={{ opacity }}
          aria-label="Scroll to About"
          className="absolute bottom-6 left-1/2 flex [@media(max-height:700px)]:hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-muted uppercase"
        >
          Scroll
          <IconArrowDown className="h-4 w-4 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
