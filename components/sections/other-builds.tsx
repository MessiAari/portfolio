"use client";

import { motion } from "motion/react";
import { otherBuilds } from "@/lib/portfolio-data";

/** Optional list of beyond-coursework builds (enabled via `showOtherBuilds`). */
export function OtherBuilds() {
  return (
    <section aria-labelledby="other-builds" className="px-4 pb-24 md:px-6">
      <div className="mx-auto max-w-6xl md:pl-[232px]">
        <h2 id="other-builds" className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          Also built, beyond coursework
        </h2>
        <ul className="mt-4 border-b border-border">
          {otherBuilds.map((build, i) => (
            <motion.li
              key={build.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="grid gap-2 border-t border-border py-5 sm:grid-cols-[200px_1fr] sm:gap-6"
            >
              <h3 className="font-mono text-xl font-semibold">{build.name}</h3>
              <div>
                <p className="text-[15px] text-foreground/80">{build.description}</p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
                  {build.tech.join(" / ")}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
