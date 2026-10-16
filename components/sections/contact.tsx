"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconCopy,
  IconMail,
  IconMapPin,
  IconMessageCircle,
} from "@tabler/icons-react";
import { openChat } from "@/components/chat-widget";
import { profile } from "@/lib/portfolio-data";

const links = [
  {
    icon: IconBrandGithub,
    label: "GitHub",
    value: `github.com/${profile.githubHandle}`,
    href: profile.github,
  },
  {
    icon: IconBrandLinkedin,
    label: "LinkedIn",
    value: "Aaritra Kumar",
    href: profile.linkedin,
  },
];

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);

  // The big heading grows into place as the section scrolls up.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative overflow-hidden rounded-t-[2.5rem] border-t border-border bg-card px-5 pt-24 pb-10 md:pt-36"
    >
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">05 — Contact</p>
        <motion.h2
          style={{ scale, opacity }}
          className="mt-4 origin-left text-5xl leading-[0.95] font-semibold tracking-tighter sm:text-7xl md:text-8xl"
        >
          Let&apos;s build
          <br />
          <span className="font-serif font-normal text-accent italic">something.</span>
        </motion.h2>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-6 md:row-span-2 md:p-8">
            <IconMail className="h-6 w-6 text-accent" />
            <p className="mt-4 text-sm text-muted">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-1 block text-[15px] font-medium break-all hover:text-accent sm:text-lg md:text-xl"
            >
              {profile.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Send an email <IconArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                {copied ? <IconCheck className="h-4 w-4" /> : <IconCopy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-border pt-6 text-sm text-muted">
              <IconMapPin className="h-5 w-5 shrink-0 text-accent" />
              {profile.location}
            </div>
          </div>

          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-3xl border border-border bg-background p-6 transition-colors hover:border-accent/50 md:p-8"
            >
              <link.icon className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted">{link.label}</p>
                <p className="truncate text-lg font-medium">{link.value}</p>
              </div>
              <IconArrowUpRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={openChat}
          className="mt-4 flex w-full items-center justify-between gap-4 rounded-3xl border border-dashed border-border p-6 text-left transition-colors hover:border-accent/50 md:p-8"
        >
          <span>
            <span className="block text-lg font-medium">Have a quick question?</span>
            <span className="text-sm text-muted">
              Ask my AI assistant about my skills and projects.
            </span>
          </span>
          <IconMessageCircle className="h-7 w-7 shrink-0 text-accent" />
        </button>

        <footer className="mt-20 flex flex-col gap-2 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            © {profile.name} · {profile.university}
          </p>
          <p>Built with Next.js, Tailwind CSS, motion, Aceternity UI &amp; Skiper UI · Chat by Gemini</p>
        </footer>
      </div>
    </section>
  );
}
