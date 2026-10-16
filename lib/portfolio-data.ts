/**
 * Single source of truth for every piece of content on the site.
 * The UI renders from these objects, and the AI chatbot's system prompt is
 * built from the same objects (see buildSystemPrompt at the bottom), so the
 * site and the chatbot can never disagree.
 */

export type Project = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  tech: string[];
  repo: string;
  live?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type JourneyStep = {
  title: string;
  heading: string;
  body: string;
  tags: string[];
};

export type OtherBuild = {
  name: string;
  description: string;
  tech: string[];
};

export const profile = {
  name: "Aaritra Kumar",
  nickname: "Aari",
  role: "Computer Science student · AI-first builder",
  degree: "B.Tech in Computer Science & Engineering",
  university: "JECRC University, Jaipur",
  batch: "2025",
  roll: "25BCON2410",
  location: "Jaipur, Rajasthan, India",
  email: "aaritra.25bcon2410@jecrcu.edu.in",
  github: "https://github.com/MessiAari",
  githubHandle: "MessiAari",
  linkedin: "https://www.linkedin.com/in/aaritra-kumar-5712b230a/",
  photo: "/aaritra.jpg",
  taglines: ["I build with AI.", "I ship products.", "I learn by building."],
  heroLine:
    "Computer Science student at JECRC University, turning ideas into things people can actually use.",
  intro:
    "I'm Aaritra, a Computer Science student at JECRC University who builds fast with AI. I treat tools like Claude Code as my engineering team: I decide what to build, direct the work, and ship it. From Python fundamentals to full-stack web apps with payments and AI voice, I like turning ideas into things people can actually use.",
  // The three verbs from the intro, used for the scroll-assembled statement.
  manifesto: ["Decide", "Direct", "Ship"],
};

export const navItems = [
  { name: "Home", link: "#home" },
  { name: "About", link: "#about" },
  { name: "Skills", link: "#skills" },
  { name: "Projects", link: "#projects" },
  { name: "Contact", link: "#contact" },
];

export const skills: SkillGroup[] = [
  { category: "Languages", items: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"] },
  { category: "Frameworks", items: ["React", "Next.js", "React Native (Expo)", "Tailwind CSS"] },
  { category: "Backend & data", items: ["Supabase", "SQLite", "REST APIs"] },
  {
    category: "AI",
    items: ["Claude Code", "Gemini API", "Groq", "ElevenLabs (voice)", "Prompt engineering"],
  },
  { category: "Payments", items: ["Razorpay", "PayPal"] },
  { category: "Tools", items: ["Git & GitHub", "Vercel", "VS Code", "Cursor", "Google Colab"] },
  {
    category: "Practices",
    items: ["Unit testing (RED → FIX → GREEN)", "Debugging", "Code refactoring"],
  },
];

export const projects: Project[] = [
  {
    id: "python-programs",
    title: "Python Programs Collection",
    description:
      "A set of core Python programs: factorial (iterative and recursive), the Fibonacci series, and converting structures into dictionaries.",
    highlights: [
      "Factorial computed two ways: an iterative loop and a recursive function",
      "Fibonacci series generator",
      "Structure-to-Dictionary conversion for a dataclass, a plain object, a list of tuples and records",
    ],
    tech: ["Python"],
    repo: "https://github.com/MessiAari/python-programs-collection",
  },
  {
    id: "messy-python",
    title: "Messy Python Code Improvement",
    description:
      "A messy student-marks script refactored with AI into clean, readable code that still produces the same output.",
    highlights: [
      "Clear, descriptive variable and function names",
      "Input validation for marks",
      "Python built-ins instead of manual loops",
      "A grade table instead of a long if-chain, with identical output",
    ],
    tech: ["Python", "AI-assisted refactoring"],
    repo: "https://github.com/MessiAari/messy-python-code-improvement",
  },
  {
    id: "bug-fixing",
    title: "Bug Fixing Using AI (student_utils)",
    description:
      "Found and fixed 3 bugs in a student utilities module using the RED → FIX → GREEN cycle backed by 9 unit tests.",
    highlights: [
      "Wrong average: divided by len - 1 instead of len",
      "Pass boundary: used > instead of >= 40, so 40 failed",
      "Unreachable Distinction grade: conditions were checked in the wrong order",
      "Went from 4 failures + 1 error to 9/9 tests passing",
    ],
    tech: ["Python", "unittest"],
    repo: "https://github.com/MessiAari/bug-fixing-student-utils",
  },
  {
    id: "quiz-app",
    title: "Interactive Quiz Application",
    description:
      "A 5-question multiple-choice quiz in the browser with progress tracking, a final score and a Play Again button.",
    highlights: [
      "Progress indicator across 5 questions",
      "Each question locks after one answer",
      "Final score screen with Play Again",
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    repo: "https://github.com/MessiAari/interactive-quiz-app",
  },
  {
    id: "reading-list",
    title: "Book Reading List Application",
    description:
      "Track books as Want to Read, Reading or Finished, with filters, summary counts and everything saved in localStorage.",
    highlights: [
      "Add books with a status: Want to Read, Reading or Finished",
      "Filter by status, change status, delete books",
      "Summary counts for each status",
      "Duplicate-title check and a 60-character title limit",
      "Saved in the browser with localStorage, deployed on Vercel",
    ],
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    repo: "https://github.com/MessiAari/reading-list-app",
    live: "https://reading-list-app-wheat.vercel.app/",
  },
];

// Every distinct technology across the projects, used for the filter chips.
export const projectTechs: string[] = Array.from(new Set(projects.flatMap((p) => p.tech)));

// The learning path told by the coursework projects, shown in the Journey timeline.
export const journey: JourneyStep[] = [
  {
    title: "2025",
    heading: "Started B.Tech CSE at JECRC University",
    body: "Joined the Computer Science & Engineering programme in Jaipur (batch 2025) and started building from day one.",
    tags: ["JECRC University", "Jaipur"],
  },
  {
    title: "Python",
    heading: "Fundamentals, written two ways",
    body: "Factorial (iterative and recursive), Fibonacci and structure-to-dictionary conversions in the Python Programs Collection.",
    tags: ["Python"],
  },
  {
    title: "Quality",
    heading: "Refactoring and debugging with AI",
    body: "Cleaned up a messy marks script, then hunted down 3 bugs with the RED → FIX → GREEN cycle until 9/9 unit tests passed.",
    tags: ["Refactoring", "unittest"],
  },
  {
    title: "Web",
    heading: "Shipping to the browser",
    body: "Built an interactive quiz and a reading list app with localStorage, and deployed the reading list live on Vercel.",
    tags: ["HTML", "CSS", "JavaScript", "Vercel"],
  },
  {
    title: "Now",
    heading: "Full-stack, AI-first",
    body: "Directing AI tools like Claude Code to build full-stack apps with Next.js, Supabase, payments and AI voice. This portfolio, with its Gemini chatbot, is one of them.",
    tags: ["Next.js", "Claude Code", "Gemini API"],
  },
];

/**
 * Beyond-coursework builds. Kept off the page (and out of the chatbot) until
 * Aari confirms they should be shown: flip `showOtherBuilds` to true.
 */
export const showOtherBuilds = false;

export const otherBuilds: OtherBuild[] = [
  {
    name: "ScopeDrop",
    description:
      "Client portal for Indian freelancers with tiered pricing; Supabase storage, Razorpay + PayPal payments; launched on Product Hunt.",
    tech: ["Supabase", "Razorpay", "PayPal"],
  },
  {
    name: "AutoSoul",
    description:
      "AI car companion: an OBD2 dongle + AI personality engine that gives your car a voice.",
    tech: ["React Native (Expo)", "Groq", "ElevenLabs"],
  },
  {
    name: "Crunchie Wunche",
    description: "Premium snack-brand website in Next.js with custom page-transition animations.",
    tech: ["Next.js"],
  },
  {
    name: "Hackathons",
    description:
      "Hacker House Goa 2026 (CryptoNominee, a crypto inheritance vault) and the PayPal AI Hackathon (CareSplit, siblings sharing caregiving costs).",
    tech: ["Hackathons"],
  },
];

export const chatSuggestions = [
  "Who are you?",
  "What projects have you completed?",
  "What was corrected in the buggy code project?",
  "Where is your GitHub?",
];

/**
 * Builds the Gemini system prompt from the data above.
 * The assistant may only answer from this text; anything else points to the email.
 */
export function buildSystemPrompt(): string {
  const skillsText = skills.map((s) => `- ${s.category}: ${s.items.join(", ")}`).join("\n");

  const projectsText = projects
    .map(
      (p, i) =>
        `${i + 1}. ${p.title}\n   ${p.description}\n   Details:\n${p.highlights
          .map((h) => `   - ${h}`)
          .join("\n")}\n   Technologies: ${p.tech.join(", ")}\n   GitHub: ${p.repo}${
          p.live ? `\n   Live demo: ${p.live}` : ""
        }`,
    )
    .join("\n\n");

  const journeyText = journey.map((j) => `- ${j.title}: ${j.heading}. ${j.body}`).join("\n");

  const otherText = showOtherBuilds
    ? `\n\nOTHER BUILDS (beyond coursework)\n${otherBuilds
        .map((b) => `- ${b.name}: ${b.description}`)
        .join("\n")}`
    : "";

  return `You are the AI assistant on ${profile.name}'s portfolio website. ${profile.name} goes by "${profile.nickname}".
Answer visitors' questions about ${profile.nickname} in a friendly, concise way (usually 2-5 sentences or a short list).
Speak about ${profile.nickname} in the third person, but if someone asks "Who are you?" or uses "you" to mean ${profile.nickname}, answer about ${profile.nickname} (e.g. "I'm Aari's portfolio assistant. Aari is ...").

RULES
- Use ONLY the information below. Do not invent projects, skills, grades, dates, employers or links.
- If the answer is not in the information below, say you don't know and suggest emailing ${profile.email}.
- Share links exactly as written below.
- Plain text only. You may use simple "- " bullet lists. No markdown headings, bold or tables.
- Politely decline requests unrelated to ${profile.nickname}'s portfolio.

PROFILE
- Name: ${profile.name} (goes by ${profile.nickname})
- Education: ${profile.degree}, ${profile.university} (batch ${profile.batch}, roll number ${profile.roll})
- Location: ${profile.location}
- Email: ${profile.email}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}

ABOUT
${profile.intro}

SKILLS
${skillsText}

PROJECTS (${projects.length} completed)
${projectsText}

JOURNEY
${journeyText}${otherText}`;
}
