"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FlipWords } from "@/components/ui/flip-words";
import { DecodeText } from "@/components/ui/decode-text";
import { BinaryPortrait } from "@/components/ui/binary-portrait";
import { openChat } from "@/components/chat-widget";
import { assistant, profile, projects } from "@/lib/portfolio-data";
import { bin, toBinary } from "@/lib/binary";

const ease = [0.22, 1, 0.36, 1] as const;

// Real numbers, shown in binary with their decimal value underneath.
const stats = [
  { value: projects.length, label: "projects" },
  { value: 9, label: "tests passing", prefix: "1001/" }, // the Bug Fixing project: 9/9 unit tests
  { value: projects.filter((p) => p.live).length, label: "live on Vercel" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // While the hero is pinned, scrolling "decodes" the portrait: the 0s and 1s
  // cross-fade into the real photo, then the whole hero drifts up and fades.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reveal = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);
  const y = useTransform(scrollYProgress, [0.45, 1], reduce ? [0, 0] : [0, -120]);
  const opacity = useTransform(scrollYProgress, [0.55, 0.85], [1, 0]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.45], reduce ? [1, 1] : [1, 1.04]);

  const [first, last] = profile.name.split(" ");

  return (
    <section id="home" ref={ref} className="relative h-[180svh]">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        {/* faint column of the name in binary, running down the left edge */}
        <p
          aria-hidden
          className="pointer-events-none absolute top-20 bottom-6 left-2 hidden w-3 font-mono text-[10px] leading-[1.15] break-all text-foreground/15 lg:block"
        >
          {toBinary(profile.name).replace(/ /g, "")}
        </p>

        <motion.div
          style={{ y, opacity }}
          className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 pt-14 pb-20 sm:gap-8 md:px-8 lg:pb-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14"
        >
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-[11px] leading-relaxed text-muted"
            >
              {toBinary(first)
                .split(" ")
                .map((byte, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: [0.25, 1, 0.6] }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                    className="mr-2 inline-block"
                  >
                    {byte}
                  </motion.span>
                ))}
            </motion.p>

            <h1 className="mt-4 font-mono text-[clamp(3.1rem,9vw,7rem)] leading-[0.95] font-bold tracking-[-0.06em]">
              <DecodeText text={first} delay={0.3} duration={1.3} className="block" />
              <DecodeText text={last} delay={0.6} duration={1.3} className="block text-accent" />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-5 min-h-[2rem] text-lg text-muted md:text-xl"
            >
              {profile.degree.replace("B.Tech in ", "B.Tech ")} student, {profile.university.split(",")[0]}.{" "}
              <span className="relative inline-block">
                <FlipWords words={profile.taglines} className="px-0 font-medium text-foreground" />
              </span>
            </motion.p>

            <motion.dl
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.7, duration: 0.8, ease }}
              className="mt-6 grid max-w-md grid-cols-3 border-y border-border sm:mt-8"
            >
              {stats.map((s, i) => (
                <div key={s.label} className={i > 0 ? "border-l border-border py-3 pl-3 sm:pl-4" : "py-3 pr-3 sm:pr-4"}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-mono text-base font-semibold tracking-tight sm:text-xl md:text-2xl">
                      {s.prefix ?? ""}
                      {bin(s.value)}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      = {s.prefix ? "9/" : ""}
                      {s.value} {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
            >
              <a
                href="#projects"
                className="rounded-full bg-foreground px-5 py-2.5 font-mono text-sm text-background transition hover:bg-accent"
              >
                ./view-projects
              </a>
              <button
                type="button"
                onClick={openChat}
                className="rounded-full border border-foreground/25 px-5 py-2.5 font-mono text-sm transition hover:border-accent hover:text-accent"
              >
                ask {assistant.name.toLowerCase()} →
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ scale: portraitScale }}
            className="order-1 mx-auto w-[46%] max-w-[420px] sm:w-[40%] lg:order-2 lg:w-full"
          >
            <BinaryPortrait
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              reveal={reveal}
              className="aspect-[4/5] rounded-2xl border border-border bg-card/40"
            />
            <p className="mt-3 flex justify-between font-mono text-[11px] text-muted">
              <span>portrait.bin</span>
              <span className="hidden sm:inline">scroll to decode ↓</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
