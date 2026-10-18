"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { assistant, chatSuggestions, profile } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
  /** true while a new reply is still being typed out */
  typing?: boolean;
};

const ERROR_MESSAGE = "Sorry, I couldn't reach the AI right now. Please try again in a moment.";
const OPEN_EVENT = "open-chat";
const PROMPT_USER = "aaritra@portfolio";
// Input is 16px on phones (so iOS doesn't zoom in) and 13px on larger screens.
const INPUT_TEXT = "text-base sm:text-[13px]";

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
 * 4. The reply comes back as JSON and is typed out in the terminal. Any failure
 *    (network, missing key, 429 quota) prints a friendly error line instead.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  // How many characters fit in the input before it starts scrolling sideways.
  const [capacity, setCapacity] = useState(Infinity);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, []);

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

  // Measure the input so the block cursor is only drawn while the text fits.
  useEffect(() => {
    if (!open || !inputRef.current) return;
    const observer = new ResizeObserver(() => {
      const charWidth = measureRef.current?.getBoundingClientRect().width;
      const width = inputRef.current?.clientWidth;
      if (charWidth && width) setCapacity(Math.floor(width / charWidth) - 1);
    });
    observer.observe(inputRef.current);
    return () => observer.disconnect();
  }, [open]);

  useEffect(scrollToBottom, [messages.length, loading, scrollToBottom]);

  const isTyping = messages.some((m) => m.typing);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading || isTyping) return;
    setInput("");

    // A little terminal touch: `clear` wipes the screen without calling the AI.
    if (question.toLowerCase() === "clear") {
      setMessages([]);
      return;
    }

    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Error lines are UI-only, so they are not sent back to the AI.
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.isError)
            .map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json().catch(() => null)) as { reply?: string } | null;
      if (!res.ok || !data?.reply) throw new Error(`Chat request failed (${res.status})`);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply!, typing: true }]);
    } catch (error) {
      console.warn(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: ERROR_MESSAGE, isError: true, typing: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const finishTyping = useCallback((index: number) => {
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, typing: false } : m)));
  }, []);

  const showBlockCursor = input.length < capacity;

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
            className="fixed right-4 bottom-4 z-[6000] flex items-center gap-2 rounded-md border border-foreground/70 bg-background px-4 py-2.5 font-mono text-[13px] text-foreground shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)] transition-colors hover:bg-foreground hover:text-background sm:right-6 sm:bottom-6"
          >
            <span className="text-accent">&gt;_</span>
            ask {assistant.name.toLowerCase()}
            <span aria-hidden className="animate-blink">▍</span>
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
            // Clicking anywhere focuses the prompt, unless the visitor is selecting text to copy.
            onClick={() => {
              if (!window.getSelection()?.toString()) inputRef.current?.focus();
            }}
            className="fixed inset-x-2 bottom-2 z-[6000] flex h-[min(620px,calc(100svh-1rem))] flex-col overflow-hidden rounded-lg border border-foreground/25 bg-background font-mono shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[440px]"
          >
            {/* Title bar */}
            <header className="flex items-center gap-3 border-b border-border bg-card px-3 py-2 text-[11px] text-muted">
              <span aria-hidden className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full border border-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full border border-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <p className="flex-1 truncate text-center">
                {assistant.name.toLowerCase()} — {PROMPT_USER}: ~
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="px-1 hover:text-accent"
              >
                [x]
              </button>
            </header>

            {/* Scrollback */}
            <div
              ref={listRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-[13px] leading-relaxed"
            >
              <div className="space-y-1 text-muted">
                <p>
                  {assistant.name} v1.0 · {assistant.tagline} · powered by Gemini
                </p>
                <p>Ask anything, run a suggestion below, or type &quot;clear&quot;.</p>
              </div>

              {messages.length === 0 && (
                <ul className="space-y-1 pt-1">
                  {chatSuggestions.map((q, i) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => send(q)}
                        className="group text-left hover:text-accent"
                      >
                        <span className="text-accent">[{i + 1}]</span>{" "}
                        <span className="group-hover:underline group-hover:underline-offset-4">{q}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p key={i} className="break-words">
                    <PromptLabel /> <span className="text-foreground">{m.content}</span>
                  </p>
                ) : (
                  <div
                    key={i}
                    className={cn(
                      "break-words whitespace-pre-wrap",
                      m.isError ? "text-accent" : "text-foreground/90",
                    )}
                  >
                    {m.isError && "! "}
                    <TypedText
                      text={m.content}
                      animate={!!m.typing}
                      onProgress={scrollToBottom}
                      onDone={() => finishTyping(i)}
                    />
                  </div>
                ),
              )}

              {loading && (
                <p className="text-muted">
                  {assistant.name.toLowerCase()} is thinking
                  <span aria-hidden className="ml-1 animate-blink text-foreground">▍</span>
                </p>
              )}
            </div>

            {/* Prompt line */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="grid grid-cols-[1fr_auto] items-center gap-x-2 gap-y-1 border-t border-border px-4 py-3 sm:flex"
            >
              <label htmlFor="chat-input" className="col-span-2 shrink-0 text-[13px] whitespace-nowrap">
                <PromptLabel />
                <span className="sr-only">Your question</span>
              </label>
              <div className="relative min-w-0 flex-1">
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  autoComplete="off"
                  spellCheck={false}
                  className={cn(
                    "w-full bg-transparent p-0 text-foreground outline-none",
                    INPUT_TEXT,
                    showBlockCursor && "caret-transparent",
                  )}
                />
                {/* Blinking block cursor drawn right after the typed text */}
                {showBlockCursor && !loading && !isTyping && (
                  <span
                    aria-hidden
                    className={cn("pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-pre", INPUT_TEXT)}
                  >
                    <span className="invisible">{input}</span>
                    <span className="animate-blink bg-foreground/80 text-transparent">_</span>
                  </span>
                )}
                <span ref={measureRef} aria-hidden className={cn("invisible absolute whitespace-pre", INPUT_TEXT)}>
                  0
                </span>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || loading || isTyping}
                aria-label="Send"
                className="shrink-0 text-[13px] text-muted transition hover:text-accent disabled:opacity-30"
              >
                ↵
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function PromptLabel() {
  return (
    <span aria-hidden>
      <span className="text-accent">{PROMPT_USER}</span>
      <span className="text-muted">:~$</span>
    </span>
  );
}

/**
 * Types a reply out line by line: each line appears a few characters at a
 * time, with a short pause before the next line starts.
 */
function TypedText({
  text,
  animate,
  onProgress,
  onDone,
}: {
  text: string;
  animate: boolean;
  onProgress: () => void;
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const instant = !animate || !!reduce;
  const [shown, setShown] = useState(instant ? text.length : 0);
  const callbacks = useRef({ onProgress, onDone });
  useEffect(() => {
    callbacks.current = { onProgress, onDone };
  });

  useEffect(() => {
    if (instant) {
      if (animate) callbacks.current.onDone();
      return;
    }
    let pos = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      if (pos >= text.length) {
        callbacks.current.onDone();
        return;
      }
      const newline = text.indexOf("\n", pos);
      const lineEnd = newline === -1 ? text.length : newline;
      pos = Math.min(pos + 3, lineEnd);
      let delay = 14;
      if (pos === lineEnd && newline !== -1) {
        pos = lineEnd + 1; // move to the next line, then pause briefly
        delay = 140;
      }
      setShown(pos);
      callbacks.current.onProgress();
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 80);
    return () => clearTimeout(timer);
  }, [text, instant, animate]);

  const done = shown >= text.length;
  return (
    <>
      <RichText text={text.slice(0, shown)} />
      {!done && <span aria-hidden className="animate-blink">▍</span>}
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
            <code key={i} className="rounded-sm bg-foreground/10 px-1">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (/^https?:\/\//.test(part)) {
          const url = part.replace(/[.,]+$/, "");
          return (
            <span key={i}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
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
              <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
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
