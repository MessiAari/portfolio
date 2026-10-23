# Aaritra Kumar — Portfolio

A scroll-driven personal portfolio for **Aaritra Kumar**, B.Tech CSE student at JECRC University, Jaipur, designed around **binary**: the portrait is drawn in 0s and 1s, text decodes from bits as you scroll, sections are numbered in binary, and light/dark mode are the two states `0` and `1`. It has a built-in AI assistant, **Assist**, that answers visitors' questions about Aaritra's skills and projects.

**Live site:** _add the Vercel URL here after deploying_
**Repository:** https://github.com/MessiAari/portfolio

## Technologies

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **motion** (`motion/react`) for scroll-linked and entrance animations
- **Aceternity UI** components: Flip Words, Floating Navbar, Infinite Moving Cards, Timeline (restyled to match the site)
- **Skiper UI** (free) component: Text Scroll animation (skiper31), used for "Decide. Direct. Ship."
- Custom components: binary portrait (canvas), decode text, scroll-decode paragraph, bit-wave theme switch
- **Google Gemini API** (`@google/genai`, models `gemini-3.1-flash-lite` → `gemini-3-flash-preview` → `gemini-2.5-flash`, with automatic fallback on quota errors) for the chatbot
- **Vercel** for hosting

## Implemented features

| Section | What it does |
| --- | --- |
| **Home** | Pinned hero. The portrait is drawn as a grid of 0s and 1s that flicker, settle into the face, light up around the mouse, and cross-fade into the real photo as you scroll. The name decodes from random bits into letters; the stats are shown in binary (`101` = 5 projects, `1001/1001` = 9/9 tests passing) |
| **Decide. Direct. Ship.** | Pinned interlude, steps numbered `01` `10` `11`: each word assembles letter by letter as you scroll |
| **About Me** (`1`) | The intro paragraph starts "encoded" as 0s and 1s and decodes word by word as you scroll, next to a `profile.json` card with education, batch, location, email and GitHub |
| **Skills** (`10`) | 7 skill groups drawn as 8-bit registers: one bit switches on per skill (count also shown in binary), plus two ticker rows of every skill that drift with the scroll |
| **Projects** (`11`) | 5 project cards (binary ID, title, description, details, technologies, GitHub link, live link); titles decode when they scroll into view; **live search and tech filter chips** |
| **Journey** (`100`) | Timeline whose line fills in as you scroll; each step's title decodes into view |
| **Contact** (`101`) | "Let's build something." decodes in, then email (with copy button), GitHub, LinkedIn and location; the name drifts past in binary as a sign-off |
| **AI Chatbot: Assist** | Floating `>_ ask assist` button on every section → a terminal-style chat (monospace, `aaritra@portfolio:~$` prompt, blinking block cursor, replies typed out line by line, `clear` command) with suggested questions and friendly error handling. Follows the light/dark theme. The name is a nod to the `MessiAari` handle (Messi, king of the assist) |

Also:

- **Light/dark mode toggle**: a `0 | 1` switch. Mode `0` is cream paper with near-black ink, mode `1` is near-black with cream text, with one cobalt accent. Switching plays a "bit wave": tiles ripple out from the switch writing the new bit across the screen, the theme flips underneath, then the tiles clear. Defaults to the OS setting (`prefers-color-scheme`), remembers your choice in `localStorage`, no flash on load.
- **Responsive** down to 375px phones, no horizontal scrolling.
- **Reduced motion**: if the OS asks for reduced motion, scroll effects and animations are switched off (text appears decoded, the theme switches instantly).
- **All content in one file**: `lib/portfolio-data.ts` feeds both the UI and the chatbot's knowledge.

## Project structure

```
app/
  layout.tsx            fonts, metadata, theme script (no flash)
  page.tsx              puts the sections together
  api/chat/route.ts     server route that calls Gemini
components/
  sections/             hero, manifesto, about, skills, projects, journey, contact, navbar
  ui/                   Aceternity / Skiper UI components (adapted)
  chat-widget.tsx       floating chatbot
  theme-provider.tsx    light/dark state, toggle and the bit-wave animation
  binary-heading.tsx    section header with the number in binary
lib/
  portfolio-data.ts     ALL site content + buildSystemPrompt() for the chatbot
  binary.ts             text/number → binary helpers
  theme-colors.ts       the two palettes (used by the bit wave)
public/aaritra.jpg      photo
```

## Setup

Requirements: Node.js 20+.

```bash
npm install
```

Create a file called `.env.local` in the project root (copy `.env.example`) and add a Gemini API key from https://aistudio.google.com/apikey:

```
GEMINI_API_KEY=your-key-here
```

Run it:

```bash
npm run dev
```

Open http://localhost:3000. Other scripts: `npm run build`, `npm start`, `npm run lint`.

## How the chatbot API is connected

```
Browser (chat-widget.tsx)
   │  POST /api/chat   { messages: [{ role, content }, ...] }
   ▼
Next.js server route (app/api/chat/route.ts)
   │  1. reads GEMINI_API_KEY from the server environment (Vercel env var / .env.local)
   │  2. builds the system prompt from lib/portfolio-data.ts (buildSystemPrompt)
   │  3. calls Gemini with the last 12 messages, trying the models listed above
   │     in order and moving to the next one on a quota (429) error
   ▼
Google Gemini  →  reply text  →  { reply }  →  typed out in the chat
```

- The system prompt tells Gemini to answer **only** from the portfolio data, and if it doesn't know, to say so and point to Aaritra's email.
- The key is **never exposed**: it has no `NEXT_PUBLIC_` prefix, is only read inside the server route, and `.env.local` is git-ignored. `.env.example` shows the variable name without a value.
- **Error handling**: the free Gemini tier only allows a few requests per minute per model. A missing key, a network failure or a 429 quota error returns a non-200 status, and the chat shows *"Sorry, I couldn't reach the AI right now. Please try again in a moment."* The page never crashes.

## How search & filter work

`components/sections/projects.tsx` keeps two pieces of React state: the search text and the selected tech chip. On every change it runs `projects.filter(...)`: a project stays if its **name or any technology** contains the search text (case-insensitive) **and** it uses the selected technology. If nothing matches, a "No projects match your search" message with a reset button is shown.

## How the theme toggle works

An inline script in `app/layout.tsx` runs before the page paints. It reads `localStorage.theme`, or falls back to `prefers-color-scheme`, and sets the `dark` class on `<html>`. Tailwind's `dark:` styles and the CSS colour variables in `globals.css` switch on that class. The `0 | 1` switch (`components/ui/theme-toggle-button.tsx`) calls `toggleTheme()` in `components/theme-provider.tsx`, which plays the bit wave, flips the class while the screen is covered, and saves the choice in `localStorage`.

## Deploying to Vercel

1. Push this repo to GitHub (`MessiAari/portfolio`).
2. On https://vercel.com, **Add New → Project**, import the repo (framework: Next.js, default settings).
3. Under **Environment Variables** add `GEMINI_API_KEY` with your key.
4. Deploy, then paste the live URL at the top of this README.

## Credits

UI components adapted from [Aceternity UI](https://ui.aceternity.com) and [Skiper UI](https://skiper-ui.com) (free components, attribution as required by Skiper UI).
