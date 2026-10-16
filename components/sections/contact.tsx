"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { openChat } from "@/components/chat-widget";
import { assistant, profile } from "@/lib/portfolio-data";

const links = [
  { label: "GitHub", value: `github.com/${profile.githubHandle}`, href: profile.github },
  { label: "LinkedIn", value: profile.name, href: profile.linkedin },
];

/** Contact is printed in reverse (ink background, paper text) to close the page. */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // The heading slides in from the side as the section scrolls up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["12%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.15, 1]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const rowClass =
    "grid gap-1 border-t border-background/15 py-5 sm:grid-cols-[160px_1fr_auto] sm:items-baseline sm:gap-6";
  const labelClass = "font-mono text-[11px] tracking-[0.14em] text-background/55 uppercase";

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden bg-foreground px-4 pt-24 pb-10 text-background md:px-6 md:pt-36"
    >
      <div className="mx-auto max-w-6xl">
        <p className={labelClass}>
          05 <span className="mx-1 opacity-40">/</span> Contact
        </p>
        <motion.h2
          style={{ x, opacity }}
          className="mt-6 font-serif text-[clamp(3.75rem,13vw,11rem)] leading-[0.88] tracking-[-0.03em]"
        >
          Let&apos;s build
          <br />
          <span className="italic text-background/60">something.</span>
        </motion.h2>

        <div className="mt-16 border-b border-background/15 md:mt-24">
          <div className={rowClass}>
            <span className={labelClass}>Email</span>
            <a
              href={`mailto:${profile.email}`}
              className="font-serif text-[1.35rem] break-all hover:italic sm:text-3xl"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="justify-self-start font-mono text-[11px] tracking-[0.14em] text-background/70 uppercase hover:text-background sm:justify-self-end"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          {links.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={`${rowClass} group`}>
              <span className={labelClass}>{link.label}</span>
              <span className="font-serif text-[1.35rem] group-hover:italic sm:text-3xl">{link.value}</span>
              <span className="hidden text-background/60 transition group-hover:translate-x-1 group-hover:text-background sm:block">
                ↗
              </span>
            </a>
          ))}
          <div className={rowClass}>
            <span className={labelClass}>Based in</span>
            <span className="font-serif text-[1.35rem] sm:text-3xl">{profile.location}</span>
          </div>
          <button type="button" onClick={openChat} className={`${rowClass} group w-full text-left`}>
            <span className={labelClass}>Quick question?</span>
            <span className="font-serif text-[1.35rem] group-hover:italic sm:text-3xl">
              Ask {assistant.name}, my AI assistant
            </span>
            <span className="hidden text-background/60 transition group-hover:translate-x-1 group-hover:text-background sm:block">
              →
            </span>
          </button>
        </div>

        <footer className="mt-20 flex flex-col gap-2 font-mono text-[11px] tracking-[0.08em] text-background/50 uppercase sm:flex-row sm:justify-between">
          <p>
            © {profile.name} · {profile.location.split(",")[0]}
          </p>
          <p>Next.js · Tailwind · motion · Aceternity UI · Skiper UI · Gemini</p>
        </footer>
      </div>
    </section>
  );
}
