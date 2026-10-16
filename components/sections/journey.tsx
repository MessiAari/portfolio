"use client";

import { Timeline } from "@/components/ui/timeline";
import { SectionHeading } from "@/components/section-heading";
import { journey } from "@/lib/portfolio-data";

export function Journey() {
  const data = journey.map((step) => ({
    title: step.title,
    content: (
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <h4 className="text-xl font-semibold tracking-tight md:text-2xl">{step.heading}</h4>
        <p className="mt-3 text-sm text-muted md:text-base">{step.body}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {step.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground/75"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  return (
    <section id="journey" className="relative px-5 py-24 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="04 — Journey"
          title="From first program to shipped product"
          description="How the projects above fit together, one step at a time."
        />
      </div>
      <Timeline data={data} />
    </section>
  );
}
