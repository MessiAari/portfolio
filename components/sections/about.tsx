"use client";

import { motion } from "motion/react";
import { BinaryHeading } from "@/components/binary-heading";
import { ScrollDecodeText } from "@/components/ui/scroll-decode-text";
import { profile } from "@/lib/portfolio-data";

// The facts as a little JSON file. `href` makes a value clickable.
const facts: { key: string; value: string; href?: string }[] = [
  { key: "name", value: profile.name },
  { key: "studying", value: profile.degree },
  { key: "university", value: profile.university },
  { key: "batch", value: profile.batch },
  { key: "roll", value: profile.roll },
  { key: "location", value: profile.location },
  { key: "email", value: profile.email, href: `mailto:${profile.email}` },
  { key: "github", value: `github.com/${profile.githubHandle}`, href: profile.github },
];

export function About() {
  return (
    <section id="about" className="relative z-10 bg-background px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <BinaryHeading index={1} title="About" />

        <div className="mt-14 grid gap-12 md:ml-[220px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
          {/* The intro decodes word by word as you scroll */}
          <ScrollDecodeText
            text={profile.intro}
            className="text-2xl leading-snug font-medium tracking-tight md:text-[1.9rem]"
          />

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="self-start overflow-hidden rounded-2xl border border-border bg-card/60"
          >
            <figcaption className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] text-muted">
              <span>profile.json</span>
              <span>{facts.length} keys</span>
            </figcaption>
            <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-7">
              <code>
                <span className="block text-muted">{"{"}</span>
                {facts.map((f, i) => (
                  <motion.span
                    key={f.key}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.09, duration: 0.35 }}
                    className="block pl-4 whitespace-pre-wrap [overflow-wrap:anywhere]"
                  >
                    <span className="text-foreground">&quot;{f.key}&quot;</span>
                    <span className="text-muted">: </span>
                    {f.href ? (
                      <a href={f.href} className="text-accent underline-offset-4 hover:underline">
                        &quot;{f.value}&quot;
                      </a>
                    ) : (
                      <span className="text-accent">&quot;{f.value}&quot;</span>
                    )}
                    {i < facts.length - 1 && <span className="text-muted">,</span>}
                  </motion.span>
                ))}
                <span className="block text-muted">{"}"}</span>
              </code>
            </pre>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
