"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  IconBrandGithub,
  IconCheck,
  IconExternalLink,
  IconMoodEmpty,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { SectionHeading } from "@/components/section-heading";
import { projects, projectTechs, type Project } from "@/lib/portfolio-data";
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
    <section id="projects" className="relative px-5 py-24 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="03 — Projects"
          title="Things I've built"
          description="Five projects, from Python fundamentals to apps running in the browser. Search by name or technology, or pick a filter."
        />

        <div className="mt-12 space-y-4">
          <label className="relative block">
            <span className="sr-only">Search projects by name or technology</span>
            <IconSearch className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search projects, e.g. "Python", "Quiz", "Book"'
              className="w-full rounded-full border border-border bg-card py-4 pr-12 pl-13 text-base text-foreground shadow-sm outline-none placeholder:text-muted/70 focus:border-accent/60 focus:ring-4 focus:ring-accent/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-foreground/10 hover:text-foreground"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by technology">
            {[null, ...projectTechs].map((tech) => {
              const active = activeTech === tech;
              return (
                <button
                  key={tech ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTech(tech)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {tech ?? "All"}
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs text-muted" aria-live="polite">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border px-6 py-16 text-center"
            >
              <IconMoodEmpty className="h-10 w-10 text-muted" />
              <p className="mt-4 text-lg font-medium">No projects match your search</p>
              <p className="mt-1 text-sm text-muted">
                Try &quot;Python&quot;, &quot;JavaScript&quot; or &quot;Book&quot; instead.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
              >
                Show all projects
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${search}|${activeTech}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProjectStack projects={filteredProjects} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * Stacking cards (in the style of Skiper UI's "Card stack scroll", skiper16):
 * every card is `position: sticky`, so as you scroll each new card slides over
 * the previous one, and the cards underneath shrink slightly to form a stack.
 */
function ProjectStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="mt-10 flex flex-col gap-[12svh] pb-[4svh]">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={i}
          total={projects.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const targetScale = 1 - (total - index - 1) * 0.04;
  const scale = useTransform(progress, [index / total, 1], reduce ? [1, 1] : [1, targetScale]);
  const number = String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, "0");

  return (
    <div className="sticky" style={{ top: `calc(5.5rem + ${index * 1.25}rem)` }}>
      <motion.article style={{ scale }} className="origin-top">
        <CardSpotlight className="rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-black/10 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-accent">{number}</span>
                <span className="h-px flex-1 bg-border" />
                {project.live && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                  </span>
                )}
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {project.title}
              </h3>
              <p className="mt-3 text-sm text-pretty text-muted md:text-base">
                {project.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-foreground/80"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 md:mt-auto md:pt-6">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
                >
                  <IconBrandGithub className="h-4 w-4" /> View code
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
                  >
                    <IconExternalLink className="h-4 w-4" /> Live demo
                  </a>
                )}
              </div>
            </div>

            <ul className="space-y-3 border-t border-border pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
              {project.highlights.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-foreground/85">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardSpotlight>
      </motion.article>
    </div>
  );
}
