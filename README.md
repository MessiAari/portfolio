# Aaritra Kumar — Portfolio

A scroll-driven personal portfolio for **Aaritra Kumar**, B.Tech CSE student at JECRC University, Jaipur, with a built-in AI assistant, **Assist**, that answers visitors' questions about Aaritra's skills and projects.

**Live site:** _add the Vercel URL here after deploying_
**Repository:** https://github.com/MessiAari/portfolio

## Technologies

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **motion** (`motion/react`) for scroll-linked and entrance animations
- **Aceternity UI** components: Flip Words, Text Generate Effect, Floating Navbar, Card Spotlight, Infinite Moving Cards, Timeline (restyled to match the site)
- **Skiper UI** (free) components: Text Scroll animation (skiper31), Card stack scroll (skiper16, as inspiration), Theme toggle button (skiper4)
- **Google Gemini API** (`@google/genai`, model `gemini-2.5-flash`) for the chatbot
- **Vercel** for hosting

## Implemented features

| Section | What it does |
| --- | --- |
| **Home** | Pinned editorial hero: the name rises in on load, the taglines rotate ("I build with AI." / "I ship products." / "I learn by building.") and everything drifts up and fades as you scroll |
| **Decide. Direct. Ship.** | Pinned interlude: each word assembles letter by letter as you scroll |
| **About Me** | Photo that opens up and moves with parallax, intro paragraph that reveals word by word with scroll, education/location/email facts |
| **Skills** | Ruled list of 7 skill groups + two large type tickers that also drift with scroll |
| **Projects** | 5 project cards (title, description, details, technologies, GitHub link, live link) that stack on top of each other while scrolling, plus **live search and tech filter chips** |
| **Journey** | Timeline whose line fills in as you scroll |
| **Contact** | Inverted (ink) block: email with copy button, GitHub, LinkedIn, location |
| **AI Chatbot: Assist** | Floating `>_ ask assist` button on every section → a terminal-style chat (monospace, `aaritra@portfolio:~$` prompt, blinking block cursor, replies typed out line by line, `clear` command) with suggested questions and friendly error handling. Follows the light/dark theme. The name is a nod to the `MessiAari` handle (Messi, king of the assist) |

Also:

- **Light/dark mode toggle**: cream paper with warm ink (light) and warm charcoal with cream text (dark), one burnt-vermilion accent. Defaults to the OS setting (`prefers-color-scheme`), remembers your choice in `localStorage`, no flash on load.
- **Responsive** down to 375px phones, no horizontal scrolling.
- **Reduced motion**: if the OS asks for reduced motion, scroll effects and animations are switched off.
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
  theme-provider.tsx    light/dark state + toggle
lib/
  portfolio-data.ts     ALL site content + buildSystemPrompt() for the chatbot
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
   │  3. calls Gemini gemini-2.5-flash with the last 12 messages
   │     (on a 429 asking to wait ≤ 8 s, it waits and retries once)
   ▼
Google Gemini  →  reply text  →  { reply }  →  shown as a chat bubble
```

- The system prompt tells Gemini to answer **only** from the portfolio data, and if it doesn't know, to say so and point to Aaritra's email.
- The key is **never exposed**: it has no `NEXT_PUBLIC_` prefix, is only read inside the server route, and `.env.local` is git-ignored. `.env.example` shows the variable name without a value.
- **Error handling**: the free Gemini tier allows 5 requests per minute. A missing key, a network failure or a 429 quota error returns a non-200 status, and the chat shows *"Sorry, I couldn't reach the AI right now. Please try again in a moment."* The page never crashes.

## How search & filter work

`components/sections/projects.tsx` keeps two pieces of React state: the search text and the selected tech chip. On every change it runs `projects.filter(...)`: a project stays if its **name or any technology** contains the search text (case-insensitive) **and** it uses the selected technology. If nothing matches, a "No projects match your search" message with a reset button is shown.

## How the theme toggle works

An inline script in `app/layout.tsx` runs before the page paints. It reads `localStorage.theme`, or falls back to `prefers-color-scheme`, and sets the `dark` class on `<html>`. Tailwind's `dark:` styles and the CSS colour variables in `globals.css` switch on that class. The toggle button (`components/ui/theme-toggle-button.tsx`) flips the class and saves the choice.

## Deploying to Vercel

1. Push this repo to GitHub (`MessiAari/portfolio`).
2. On https://vercel.com, **Add New → Project**, import the repo (framework: Next.js, default settings).
3. Under **Environment Variables** add `GEMINI_API_KEY` with your key.
4. Deploy, then paste the live URL at the top of this README.

## Credits

UI components adapted from [Aceternity UI](https://ui.aceternity.com) and [Skiper UI](https://skiper-ui.com) (free components, attribution as required by Skiper UI).
