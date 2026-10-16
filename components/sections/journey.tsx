"use client";

import { Timeline } from "@/components/ui/timeline";
import { SectionHeading } from "@/components/section-heading";
import { journey } from "@/lib/portfolio-data";

export function Journey() {
  const data = journey.map((step) => ({
    title: step.title,
    content: (
      <div className="border-t border-border pt-5">
        <h4 className="font-serif text-3xl leading-tight md:text-4xl">{step.heading}</h4>
        <p className="mt-3 max-w-xl text-[15px] text-foreground/75">{step.body}</p>
        <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          {step.tags.join("  /  ")}
        </p>
      </div>
    ),
  }));

  return (
    <section id="journey" className="relative px-4 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="Journey"
          title="From first program to shipped product"
          description="How the projects above fit together, one step at a time."
        />
      </div>
      <Timeline data={data} />
    </section>
  );
}
