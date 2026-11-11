"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { easeExpo } from "./Reveal";

const suggestions = ["What does Hein Htet do?", "Show me the projects", "How do I get in touch?", "What's in the shop?"];

/** Renders the small subset of markdown the assistant uses: links, **bold** and "- " lists. */
export function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const inline = (line: string) =>
    line.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).map((chunk, i) => {
      const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        return href.startsWith("/") ? (
          <Link key={i} href={href} onClick={onNavigate} className="underline underline-offset-[3px] hover:opacity-60">
            {label}
          </Link>
        ) : (
          <a key={i} href={href} target="_blank" rel="noreferrer" className="underline underline-offset-[3px] hover:opacity-60">
            {label}
          </a>
        );
      }
      const bold = chunk.match(/^\*\*([^*]+)\*\*$/);
      return bold ? <strong key={i} className="font-medium">{bold[1]}</strong> : <Fragment key={i}>{chunk}</Fragment>;
    });

  return (
    <div className="space-y-2">
      {text
        .trim()
        .split(/\n+/)
        .map((line, i) =>
          /^\s*[-*•]\s+/.test(line) ? (
            <p key={i} className="flex gap-2 pl-1">
              <span aria-hidden="true">–</span>
              <span>{inline(line.replace(/^\s*[-*•]\s+/, ""))}</span>
            </p>
          ) : (
            <p key={i}>{inline(line)}</p>
          ),
        )}
    </div>
  );
}

export function errorText(error: Error) {
  try {
    return (JSON.parse(error.message) as { error?: string }).error ?? error.message;
  } catch {
    return "Something went wrong. Please try again.";
  }
}

/** Floating "Ask AI" bar, centred at the bottom of the screen; expands into a chat panel. */
export function AskAI() {
  const { messages, sendMessage, status, stop, error, clearError, setMessages } = useChat();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";
  // Expanded while focused, typing, answering, or showing the conversation
  const active = focused || open || busy || input.length > 0;

  // Slide the bar in shortly after the page loads
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Keep the newest message in view
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    if (error) clearError();
    sendMessage({ text: q });
    setInput("");
    setOpen(true);
  };

  const pill =
    "rounded-full border border-fg bg-fg px-[14px] py-[5px] leading-none text-bg transition-opacity duration-300 hover:opacity-80 disabled:opacity-30";

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-4 z-[55] flex justify-center px-3"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <motion.div
            layout
            // Small pill at rest; eases out to full width while you're using it
            initial={false}
            animate={{ width: active ? 520 : 168 }}
            style={{ borderRadius: 24 }}
            transition={{ duration: 0.6, ease: easeExpo }}
            onClick={() => inputRef.current?.focus()}
            className={`pointer-events-auto max-w-full overflow-hidden border border-line bg-bg text-[15px] text-fg ${active ? "" : "cursor-pointer"}`}
          >
            {/* Conversation */}
            <AnimatePresence initial={false}>
              {open && messages.length > 0 && (
                <motion.div
                  key="chat"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeExpo }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-line px-4 py-2 text-[13px]">
                    <span className="text-muted">Ask about this site</span>
                    <div className="flex gap-4">
                      <button
                        className="u-hover"
                        onClick={() => {
                          stop();
                          setMessages([]);
                          clearError();
                          setOpen(false);
                        }}
                      >
                        Clear
                      </button>
                      <button className="u-hover" onClick={() => setOpen(false)} aria-label="Minimise chat">
                        Close
                      </button>
                    </div>
                  </div>

                  <div ref={listRef} className="max-h-[min(50vh,380px)] space-y-3 overflow-y-auto px-4 py-4">
                    {messages.map((m) => {
                      const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                      return m.role === "user" ? (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: easeExpo }}
                          className="flex justify-end"
                        >
                          <p className="max-w-[80%] rounded-[14px] bg-surface px-3 py-1.5">{text}</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={m.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                          className="max-w-[92%] leading-[1.4]"
                        >
                          <Rich text={text} onNavigate={() => setOpen(false)} />
                        </motion.div>
                      );
                    })}

                    {status === "submitted" && (
                      <div className="flex gap-1.5 py-2" aria-label="Thinking">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="size-1.5 rounded-full bg-fg/50"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    )}

                    {error && <p className="rounded-[12px] bg-surface px-3 py-2 text-[14px] text-fg/70">{errorText(error)}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestions while the input is focused and nothing has been asked yet */}
            <AnimatePresence initial={false}>
              {focused && messages.length === 0 && (
                <motion.div
                  key="tips"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: easeExpo }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5 px-4 pt-3">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => ask(s)}
                        className="rounded-full border border-line px-3 py-1 text-[13px] leading-none transition-colors hover:border-fg hover:bg-fg hover:text-bg"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The bar itself */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex h-[43px] items-center gap-2.5 pl-4 pr-2"
            >
              <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="currentColor" aria-hidden="true">
                <path d="M12 2c.4 4.6 2.4 6.6 7 7-4.6.4-6.6 2.4-7 7-.4-4.6-2.4-6.6-7-7 4.6-.4 6.6-2.4 7-7Zm7 11c.2 2.3 1.2 3.3 3.5 3.5-2.3.2-3.3 1.2-3.5 3.5-.2-2.3-1.2-3.3-3.5-3.5 2.3-.2 3.3-1.2 3.5-3.5Z" />
              </svg>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => {
                  setFocused(true);
                  if (messages.length) setOpen(true);
                }}
                onBlur={() => setFocused(false)}
                placeholder={!active ? "Ask AI" : messages.length ? "Ask a follow-up…" : "Ask anything about this site…"}
                aria-label="Ask the assistant"
                className={`min-w-0 flex-1 bg-transparent outline-none transition-colors duration-300 ${active ? "placeholder:text-muted" : "cursor-pointer placeholder:text-fg"}`}
              />
              {active && !open && messages.length > 0 && (
                <button type="button" className="u-hover shrink-0" onClick={() => setOpen(true)}>
                  Show chat
                </button>
              )}
              <AnimatePresence initial={false}>
                {active && (
                  <motion.span
                    key="action"
                    className="shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: easeExpo }}
                  >
                    {busy ? (
                      <button type="button" onClick={stop} className={pill}>
                        Stop
                      </button>
                    ) : (
                      // Keep focus in the input so the bar doesn't collapse mid-click
                      <button type="submit" disabled={!input.trim()} onMouseDown={(e) => e.preventDefault()} className={pill}>
                        Ask
                      </button>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
              {!active && messages.length > 0 && <span className="size-1.5 shrink-0 rounded-full bg-fg" aria-label="Chat in progress" />}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
