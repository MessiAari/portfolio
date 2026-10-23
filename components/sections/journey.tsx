"use client";

import { Timeline } from "@/components/ui/timeline";
import { DecodeText } from "@/components/ui/decode-text";
import { BinaryHeading } from "@/components/binary-heading";
import { journey } from "@/lib/portfolio-data";
import { bin } from "@/lib/binary";

export function Journey() {
  const data = journey.map((step, i) => ({
    title: step.title,
    content: (
      <article className="rounded-2xl border border-border bg-card/50 p-6 md:p-7">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">{bin(i + 1).padStart(3, "0")}</span> · step {i + 1}
        </p>
        <h4 className="mt-2 font-mono text-xl leading-snug font-semibold tracking-tight md:text-2xl">
          <DecodeText text={step.heading} trigger="inView" duration={0.9} />
        </h4>
        <p className="mt-3 max-w-xl text-[15px] text-foreground/75">{step.body}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {step.tags.map((tag) => (
            <li key={tag} className="rounded-md bg-foreground/[0.06] px-2 py-0.5 font-mono text-[12px] text-foreground/80">
              {tag}
            </li>
          ))}
        </ul>
      </article>
    ),
  }));

  return (
    <section id="journey" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <BinaryHeading
          index={4}
          title="Journey"
          description="From first program to shipped product, one step at a time."
        />
      </div>
      <Timeline data={data} />
    </section>
  );
}
