"use client";

import { motion } from "motion/react";
import { otherBuilds } from "@/lib/portfolio-data";

/** Optional strip of beyond-coursework builds (enabled via `showOtherBuilds`). */
export function OtherBuilds() {
  return (
    <section aria-labelledby="other-builds" className="px-5 pb-24">
      <div className="mx-auto max-w-6xl">
        <h2 id="other-builds" className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          Beyond coursework
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {otherBuilds.map((build, i) => (
            <motion.div
              key={build.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-3xl border border-border bg-card p-5"
            >
              <h3 className="font-semibold">{build.name}</h3>
              <p className="mt-2 text-sm text-muted">{build.description}</p>
              <p className="mt-4 font-mono text-xs text-foreground/70">{build.tech.join(" · ")}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
