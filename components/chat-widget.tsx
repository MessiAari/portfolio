"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { assistant, chatSuggestions, profile } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string; isError?: boolean };

const ERROR_MESSAGE = "Sorry, I couldn't reach the AI right now. Please try again in a moment.";
const OPEN_EVENT = "open-chat";

/** Lets any button on the page open the chat panel. */
export function openChat() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/*
 * CHATBOT FLOW:
 * 1. The visitor types a question here (browser).
 * 2. send() POSTs the conversation to our own server route, /api/chat.
 * 3. app/api/chat/route.ts adds the system prompt built from portfolio-data.ts
 *    and calls Gemini with GEMINI_API_KEY, which only exists on the server
 *    (Vercel environment variable) and is never sent to the browser.
 * 4. The reply comes back as JSON and is shown in the panel. Any failure
 *    (network, missing key, 429 quota) shows a friendly error message instead.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Error messages are UI-only, so they are not sent back to the AI.
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.isError)
            .map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { reply?: string } | null;
      if (!res.ok || !data?.reply) throw new Error(`Chat request failed (${res.status})`);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch (error) {
      console.warn(error);
      setMessages((prev) => [...prev, { role: "assistant", content: ERROR_MESSAGE, isError: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            aria-label={`Open chat with ${assistant.name}, ${profile.firstName}'s AI assistant`}
            className="group fixed right-4 bottom-4 z-[6000] flex items-center gap-3 rounded-full border border-foreground bg-foreground py-2 pr-5 pl-2 text-background shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)] transition-colors hover:bg-background hover:text-foreground sm:right-6 sm:bottom-6"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent font-serif text-lg text-background italic">
              A
            </span>
            <span className="text-sm font-medium">Ask {assistant.name}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`Chat with ${assistant.name}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-2 bottom-2 z-[6000] flex h-[min(620px,calc(100svh-1rem))] flex-col overflow-hidden rounded-lg border border-foreground/25 bg-background shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
          >
            <header className="flex items-start justify-between gap-3 border-b border-border px-5 pt-4 pb-3">
              <div>
                <p className="font-serif text-3xl leading-none">{assistant.name}</p>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  {assistant.tagline} · Gemini
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="-mr-1 p-1 text-muted hover:text-foreground"
              >
                <IconX className="h-5 w-5" stroke={1.5} />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5">
              {messages.length === 0 && (
                <div>
                  <p className="font-serif text-2xl leading-snug">
                    Ask me about {profile.firstName}&apos;s skills, projects, or how to get in touch.
                  </p>
                  <p className="mt-6 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    Try asking
                  </p>
                  <ul className="mt-2 border-b border-border">
                    {chatSuggestions.map((q) => (
                      <li key={q}>
                        <button
                          type="button"
                          onClick={() => send(q)}
                          className="group flex w-full items-center justify-between gap-3 border-t border-border py-3 text-left text-[15px] transition-colors hover:text-accent"
                        >
                          {q}
                          <span className="text-muted transition group-hover:translate-x-1 group-hover:text-accent">
                            →
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] rounded-md bg-foreground px-3.5 py-2 text-[15px] break-words whitespace-pre-wrap text-background">
                      {m.content}
                    </p>
                  </div>
                ) : (
                  <div key={i} className="border-l-2 border-accent pl-3.5">
                    <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                      {assistant.name}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[15px] leading-relaxed break-words whitespace-pre-wrap",
                        m.isError && "text-accent",
                      )}
                    >
                      <RichText text={m.content} />
                    </p>
                  </div>
                ),
              )}

              {loading && (
                <div className="border-l-2 border-accent pl-3.5" aria-label={`${assistant.name} is typing`}>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                    {assistant.name}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-foreground/50"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-3 border-t border-border px-5 py-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a question…"
                maxLength={500}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent py-2 text-base text-foreground outline-none placeholder:text-muted/70 sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="font-mono text-[11px] tracking-[0.14em] uppercase transition hover:text-accent disabled:opacity-30"
              >
                Send ↵
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Renders the AI's reply: links for URLs/emails and `inline code` spans. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^`[^`]+`$/.test(part)) {
          return (
            <code key={i} className="rounded-sm bg-foreground/10 px-1 font-mono text-[0.85em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (/^https?:\/\//.test(part)) {
          const url = part.replace(/[.,]+$/, "");
          return (
            <span key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="link text-accent">
                {url}
              </a>
              {part.slice(url.length)}
            </span>
          );
        }
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
          const email = part.replace(/[.]+$/, "");
          return (
            <span key={i}>
              <a href={`mailto:${email}`} className="link text-accent">
                {email}
              </a>
              {part.slice(email.length)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
