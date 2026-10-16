"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { IconArrowUp, IconMessageCircle, IconX } from "@tabler/icons-react";
import { chatSuggestions, profile } from "@/lib/portfolio-data";
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
 * 4. The reply comes back as JSON and is shown as a chat bubble. Any failure
 *    (network, missing key, 429 quota) shows a friendly error bubble instead.
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
        // Error bubbles are UI-only, so they are not sent back to the AI.
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
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open chat with Aari's AI assistant"
            className="fixed right-4 bottom-4 z-[6000] flex items-center gap-2 rounded-full bg-foreground py-3.5 pr-5 pl-4 text-sm font-medium text-background shadow-2xl shadow-black/30 sm:right-6 sm:bottom-6"
          >
            <IconMessageCircle className="h-5 w-5" />
            <span>Ask AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Aari's AI assistant"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-x-2 bottom-2 z-[6000] flex h-[min(620px,calc(100svh-1rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/40 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
          >
            <header className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Image
                src={profile.photo}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover object-top"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Aari&apos;s AI assistant</p>
                <p className="truncate text-xs text-muted">Answers from this portfolio · Gemini</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-2 text-muted hover:bg-foreground/10 hover:text-foreground"
              >
                <IconX className="h-5 w-5" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
              {messages.length === 0 && (
                <div className="py-4 text-center">
                  <p className="font-serif text-2xl italic">Hi! 👋</p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
                    Ask me anything about {profile.nickname}&apos;s skills, projects or how to get in
                    touch.
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-2">
                    {chatSuggestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/85 transition-colors hover:border-accent/50 hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
                      m.role === "user"
                        ? "rounded-br-md bg-foreground text-background"
                        : m.isError
                          ? "rounded-bl-md border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300"
                          : "rounded-bl-md border border-border bg-card text-foreground",
                    )}
                  >
                    {m.role === "assistant" ? <Linkified text={m.content} /> : m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-muted"
                        animate={{ opacity: [0.3, 1, 0.3] }}
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
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <label htmlFor="chat-input" className="sr-only">
                Your question
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                maxLength={500}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-base text-foreground outline-none placeholder:text-muted/70 focus:border-accent/60 sm:text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition disabled:opacity-30"
              >
                <IconArrowUp className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Turns URLs and email addresses in the AI's reply into clickable links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          const url = part.replace(/[.,]+$/, "");
          return (
            <span key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
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
              <a href={`mailto:${email}`} className="text-accent underline underline-offset-2">
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
