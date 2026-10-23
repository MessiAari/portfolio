"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { BinaryHeading } from "@/components/binary-heading";
import { DecodeText } from "@/components/ui/decode-text";
import { projects, projectTechs, type Project } from "@/lib/portfolio-data";
import { bin, toBinary } from "@/lib/binary";
import { cn } from "@/lib/utils";

export function Projects() {
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);

  /*
   * SEARCH + FILTER — how it works:
   * `query` (the search box) and `activeTech` (the selected chip) live in React
   * state. Every time either changes, React re-renders and we run .filter() over
   * the projects array: a project stays if its NAME or any of its TECHNOLOGIES
   * contains the search text (case-insensitive) AND it uses the selected chip's
   * technology (or no chip is selected). Only the matching cards are rendered.
   */
  const search = query.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      search === "" ||
      project.title.toLowerCase().includes(search) ||
      project.tech.some((tech) => tech.toLowerCase().includes(search));
    const matchesTech = activeTech === null || project.tech.includes(activeTech);
    return matchesSearch && matchesTech;
  });

  const resetFilters = () => {
    setQuery("");
    setActiveTech(null);
  };

  return (
    <section id="projects" className="relative px-5 py-24 md:px-8 md:py-36">
      <div className="mx-auto max-w-6xl">
        <BinaryHeading
          index={3}
          title="Projects"
          description="Five projects, from Python fundamentals to apps running in the browser. Search by name or technology, or pick a filter."
        />

        <div className="mt-12 md:ml-[220px]">
          <label className="relative flex items-center gap-3 border-b border-foreground/40 pb-2 focus-within:border-accent">
            <span className="sr-only">Search projects by name or technology</span>
            <span aria-hidden className="font-mono text-lg text-accent">
              &gt;
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search: python, quiz, book…"
              className="min-w-0 flex-1 bg-transparent font-mono text-lg text-foreground outline-none placeholder:text-muted/60 md:text-xl [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="p-1 text-muted hover:text-foreground"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="mt-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter by technology">
            {[null, ...projectTechs].map((tech) => {
              const active = activeTech === tech;
              return (
                <button
                  key={tech ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTech(tech)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-[12px] transition-colors",
                    active
                      ? "border-accent bg-accent text-background"
                      : "border-border text-foreground/70 hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {tech ?? "all"}
                </button>
              );
            })}
          </div>

          <p className="mt-4 font-mono text-xs text-muted" aria-live="polite">
            {bin(filteredProjects.length)}/{bin(projects.length)} · showing {filteredProjects.length} of {projects.length}{" "}
            projects
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 rounded-2xl border border-dashed border-border px-6 py-16 text-center md:ml-[220px]"
            >
              <p className="font-mono text-6xl font-bold text-accent">0</p>
              <p className="mt-3 font-mono text-lg">No projects match your search.</p>
              <p className="mt-1 text-sm text-muted">Try &quot;Python&quot;, &quot;JavaScript&quot; or &quot;Book&quot;.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-foreground px-5 py-2 font-mono text-sm text-background"
              >
                show all projects
              </button>
            </motion.div>
          ) : (
            <motion.ul
              key={`${search}|${activeTech}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-10 grid gap-5 md:grid-cols-2"
            >
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} order={i} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({ project, order }: { project: Project; order: number }) {
  const number = projects.findIndex((p) => p.id === project.id) + 1;
  // A faint field of the project's own name in binary, shown on hover.
  const bits = toBinary(project.title).replace(/ /g, "").repeat(4);

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: (order % 2) * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-colors duration-300 hover:border-accent/60 md:p-8"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute inset-0 font-mono text-[10px] leading-[1.1] break-all text-accent opacity-0 transition-opacity duration-500 select-none group-hover:opacity-[0.07]"
      >
        {bits}
      </p>

      <div className="relative flex items-center gap-3 font-mono text-xs">
        <span className="text-accent">{bin(number).padStart(3, "0")}</span>
        <span className="text-muted">#{number}</span>
        {project.live && (
          <span className="ml-auto flex items-center gap-1.5 text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> live
          </span>
        )}
      </div>

      <h3 className="relative mt-5 font-mono text-xl leading-snug font-semibold tracking-tight md:text-2xl">
        <DecodeText text={project.title} trigger="inView" duration={0.9} delay={(order % 2) * 0.15} />
      </h3>
      <p className="relative mt-3 text-[15px] text-pretty text-foreground/75">{project.description}</p>

      <ul className="relative mt-5 space-y-2 text-sm text-foreground/80">
        {project.highlights.map((point) => (
          <li key={point} className="flex gap-2.5">
            <span aria-hidden className="font-mono text-accent">
              ›
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-7">
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.tech.map((tech) => (
            <li key={tech} className="rounded-md bg-foreground/[0.07] px-2 py-0.5 font-mono text-[12px] text-foreground/80">
              {tech}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-5 border-t border-border pt-4 font-mono text-sm">
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
            github ↗
          </a>
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-accent hover:opacity-80">
              live site ↗
            </a>
          )}
        </div>
      </div>
    </motion.li>
  );
}
