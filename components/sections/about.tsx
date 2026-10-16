"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { IconMapPin, IconSchool, IconId, IconMail } from "@tabler/icons-react";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/lib/portfolio-data";

const facts = [
  { icon: IconSchool, label: "Education", value: `${profile.degree}, ${profile.university}` },
  { icon: IconId, label: "Batch · Roll no.", value: `${profile.batch} · ${profile.roll}` },
  { icon: IconMapPin, label: "Location", value: profile.location },
  { icon: IconMail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Parallax: the photo drifts slower than the page and the frame tilts in.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "12%"]);
  const frameRotate = useTransform(scrollYProgress, [0, 0.4], reduce ? [0, 0] : [-6, 0]);
  const frameScale = useTransform(scrollYProgress, [0, 0.4], reduce ? [1, 1] : [0.88, 1]);
  const badgeY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative z-10 rounded-t-[2.5rem] border-t border-border bg-background px-5 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[5fr_7fr] md:gap-20">
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            style={{ rotate: frameRotate, scale: frameScale }}
            className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/20"
          >
            <motion.div style={{ y: photoY }} className="absolute -inset-y-[14%] inset-x-0">
              <Image
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 font-serif text-2xl text-white italic">
              {profile.nickname}
            </p>
          </motion.div>
          <motion.div
            style={{ y: badgeY }}
            className="absolute -right-2 top-10 rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm shadow-xl backdrop-blur-md sm:-right-8"
          >
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase">Based in</p>
            <p className="font-medium">Jaipur, India</p>
          </motion.div>
        </div>

        <div>
          <SectionHeading
            eyebrow="01 — About me"
            title={
              <>
                Hi, I&apos;m <span className="font-serif font-normal italic">Aari</span>.
              </>
            }
          />
          <ScrollRevealText
            text={profile.intro}
            className="mt-8 text-xl leading-relaxed font-medium tracking-tight md:text-2xl"
          />
          <dl className="mt-10 grid gap-3 sm:grid-cols-2">
            {facts.map((fact, i) => (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <fact.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div className="min-w-0">
                  <dt className="text-xs text-muted">{fact.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium break-words">
                    {fact.href ? (
                      <a href={fact.href} className="hover:text-accent">
                        {fact.value}
                      </a>
                    ) : (
                      fact.value
                    )}
                  </dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
