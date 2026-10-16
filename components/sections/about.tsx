"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/lib/portfolio-data";

const facts = [
  { label: "Studying", value: `${profile.degree}, ${profile.university}` },
  { label: "Batch", value: `${profile.batch} · Roll no. ${profile.roll}` },
  { label: "Based in", value: profile.location },
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Parallax: the photo moves slower than the page inside its frame,
  // and the frame itself opens up from a narrow slit as it enters.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-10%", "10%"]);
  const clip = useTransform(
    scrollYProgress,
    [0.05, 0.35],
    reduce ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(18% 12% 18% 12%)", "inset(0% 0% 0% 0%)"],
  );

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-10 bg-background px-4 pt-24 pb-24 md:px-6 md:pt-32 md:pb-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading index="01" label="About" title={<>Hello, I&apos;m {profile.firstName}.</>} />

        <div className="mt-14 grid gap-12 md:grid-cols-[200px_1fr] md:gap-8">
          <div className="hidden md:block" />
          <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <figure className="mx-auto w-full max-w-sm lg:max-w-none">
              <motion.div
                style={{ clipPath: clip }}
                className="relative aspect-[4/5] overflow-hidden bg-card"
              >
                <motion.div style={{ y: photoY }} className="absolute -inset-y-[12%] inset-x-0">
                  <Image
                    src={profile.photo}
                    alt={`Portrait of ${profile.name}`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 400px"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>
              <figcaption className="mt-3 flex justify-between font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                <span>Fig. 01</span>
                <span>{profile.name}, Jaipur</span>
              </figcaption>
            </figure>

            <div>
              <ScrollRevealText
                text={profile.intro}
                className="font-serif text-[1.7rem] leading-[1.2] tracking-[-0.01em] md:text-[2.1rem]"
              />
              <dl className="mt-12 border-b border-border">
                {facts.map((fact, i) => (
                  <motion.div
                    key={fact.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="grid gap-1 border-t border-border py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
                  >
                    <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase sm:pt-1">
                      {fact.label}
                    </dt>
                    <dd className="text-[15px] break-words">
                      {fact.href ? (
                        <a href={fact.href} className="link break-all">
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
