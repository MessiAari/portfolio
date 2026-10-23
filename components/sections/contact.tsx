"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { openChat } from "@/components/chat-widget";
import { DecodeText } from "@/components/ui/decode-text";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { assistant, profile } from "@/lib/portfolio-data";
import { bin, toBinary } from "@/lib/binary";

const links = [
  { label: "github", value: `github.com/${profile.githubHandle}`, href: profile.github },
  { label: "linkedin", value: profile.name, href: profile.linkedin },
];

const row =
  "group grid gap-1 border-t border-border py-5 sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-6";
const label = "font-mono text-xs text-muted";
const value = "font-mono text-lg font-medium tracking-tight sm:text-2xl";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const reveal = (i: number) => ({
    initial: { opacity: 0, x: -16 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay: 0.1 + i * 0.08, duration: 0.5 },
  });

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border bg-card/40 pt-24 pb-10 md:pt-36">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="font-mono">
          <span className="text-4xl font-semibold tracking-tight text-accent md:text-5xl">{bin(5)}</span>
          <span className="ml-2 align-top text-xs text-muted">= 5 · contact</span>
        </p>
        <h2 className="mt-6 font-mono text-[clamp(2.6rem,9vw,7.5rem)] leading-[0.95] font-bold tracking-[-0.06em]">
          <DecodeText text="Let's build" trigger="inView" duration={1.1} className="block" />
          <DecodeText text="something." trigger="inView" delay={0.3} duration={1.1} className="block text-accent" />
        </h2>

        <div className="mt-16 border-b border-border md:mt-20">
          <motion.div {...reveal(0)} className={row}>
            <span className={label}>email</span>
            <a href={`mailto:${profile.email}`} className={`${value} break-all hover:text-accent`}>
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="justify-self-start font-mono text-xs text-muted hover:text-accent sm:justify-self-end"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </motion.div>
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              {...reveal(i + 1)}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={row}
            >
              <span className={label}>{link.label}</span>
              <span className={`${value} group-hover:text-accent`}>{link.value}</span>
              <span className="hidden font-mono text-muted transition group-hover:translate-x-1 group-hover:text-accent sm:block">
                ↗
              </span>
            </motion.a>
          ))}
          <motion.div {...reveal(3)} className={row}>
            <span className={label}>location</span>
            <span className={value}>{profile.location}</span>
          </motion.div>
          <motion.button {...reveal(4)} type="button" onClick={openChat} className={`${row} w-full text-left`}>
            <span className={label}>quick question?</span>
            <span className={`${value} group-hover:text-accent`}>ask {assistant.name.toLowerCase()}, my AI assistant</span>
            <span className="hidden font-mono text-muted transition group-hover:translate-x-1 group-hover:text-accent sm:block">
              →
            </span>
          </motion.button>
        </div>
      </div>

      {/* sign-off: the name in binary, drifting past */}
      <div aria-hidden className="mt-20">
        <InfiniteMovingCards
          items={[toBinary(profile.name)]}
          speed="slow"
          separator="·"
          pauseOnHover={false}
          itemClassName="font-mono text-sm text-foreground/25"
        />
      </div>

      <footer className="mx-auto mt-8 flex max-w-6xl flex-col gap-2 px-5 font-mono text-xs text-muted sm:flex-row sm:justify-between md:px-8">
        <p>
          © {profile.name} · {profile.location.split(",")[0]}
        </p>
        <p>{"// EOF"}</p>
      </footer>
    </section>
  );
}
