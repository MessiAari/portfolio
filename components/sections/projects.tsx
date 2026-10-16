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
import { IconSearch, IconX } from "@tabler/icons-react";
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
    <section id="projects" className="relative px-4 py-24 md:px-6 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="03"
          label="Projects"
          title="Selected work"
          description="Five projects, from Python fundamentals to apps running in the browser. Search by name or technology, or pick a filter."
        />

        <div className="mt-12 md:ml-[232px]">
          <label className="relative block">
            <span className="sr-only">Search projects by name or technology</span>
            <IconSearch
              stroke={1.5}
              className="pointer-events-none absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: Python, Quiz, Book…"
              className="w-full border-b border-foreground/40 bg-transparent py-3 pr-10 pl-8 font-serif text-2xl text-foreground outline-none placeholder:text-muted/60 focus:border-accent md:text-3xl [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-muted hover:text-foreground"
              >
                <IconX className="h-5 w-5" />
              </button>
            )}
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by technology">
            <span className="mr-1 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">Filter</span>
            {[null, ...projectTechs].map((tech) => {
              const active = activeTech === tech;
              return (
                <button
                  key={tech ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveTech(tech)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[13px] transition-colors",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground/70 hover:border-foreground/50 hover:text-foreground",
                  )}
                >
                  {tech ?? "All"}
                </button>
              );
            })}
          </div>

          <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-muted uppercase" aria-live="polite">
            {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 border-y border-border py-16 text-center md:ml-[232px]"
            >
              <p className="font-serif text-4xl italic">Nothing here yet.</p>
              <p className="mt-3 text-sm text-muted">
                No projects match your search. Try &quot;Python&quot;, &quot;JavaScript&quot; or &quot;Book&quot;.
              </p>
              <button type="button" onClick={resetFilters} className="link mt-6 text-sm font-medium">
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
    <div ref={ref} className="mt-12 flex flex-col gap-[12svh] pb-[4svh]">
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
  const targetScale = 1 - (total - index - 1) * 0.035;
  const scale = useTransform(progress, [index / total, 1], reduce ? [1, 1] : [1, targetScale]);
  const number = String(projects.findIndex((p) => p.id === project.id) + 1).padStart(2, "0");

  return (
    <div className="sticky" style={{ top: `calc(4.5rem + ${index * 1.1}rem)` }}>
      <motion.article style={{ scale }} className="origin-top">
        <CardSpotlight className="rounded-md border border-border bg-card p-6 shadow-[0_-12px_40px_-20px_rgb(0_0_0/0.35)] sm:p-8 md:p-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
            <span className="font-serif text-4xl text-accent md:text-5xl">{number}</span>
            <ul className="flex flex-wrap justify-end gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.1em] text-muted uppercase" aria-label="Technologies">
              {project.tech.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-[1.15fr_1fr] md:gap-12">
            <div className="flex flex-col">
              <h3 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.01em] text-balance md:text-5xl">
                {project.title}
              </h3>
              <p className="mt-4 text-[15px] text-pretty text-foreground/75">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium md:mt-auto md:pt-8">
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link">
                  Code on GitHub ↗
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-accent"
                  >
                    Live site ↗
                  </a>
                )}
              </div>
            </div>

            <ol className="space-y-3 text-sm text-foreground/80">
              {project.highlights.map((point, i) => (
                <li key={point} className="grid grid-cols-[1.75rem_1fr] border-t border-border pt-3">
                  <span className="font-mono text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardSpotlight>
      </motion.article>
    </div>
  );
}
