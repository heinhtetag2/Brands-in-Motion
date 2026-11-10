"use client";

import { useChat } from "@ai-sdk/react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { site } from "@/lib/data";
import { easeExpo } from "./Reveal";

const suggestions = ["Find a 3D studio", "Any remote jobs?", "Show me interviews", "What's on sale?"];

/** Renders the small subset of markdown the assistant uses: links, **bold** and "- " lists. */
function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
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

function errorText(error: Error) {
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
    "rounded-full bg-[#0f0f0f] px-6 py-[11px] text-white transition-[transform,background-color,opacity] duration-300 hover:bg-[#333] active:scale-[0.97] disabled:opacity-30";

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-[18px] z-[55] flex justify-center px-3"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.7, ease: easeExpo }}
        >
          <motion.div
            layout
            transition={{ duration: 0.5, ease: easeExpo }}
            className="pointer-events-auto w-full max-w-[816px] overflow-hidden rounded-[22px] bg-white text-[17px] text-[#0f0f0f] shadow-[0_6px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5"
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
                  <div className="flex items-center justify-between border-b border-black/10 px-5 py-3 text-sm sm:px-6">
                    <span className="text-black/50">Ask {site.name}</span>
                    <div className="flex gap-4">
                      <button
                        className="text-black/50 hover:text-black"
                        onClick={() => {
                          stop();
                          setMessages([]);
                          clearError();
                          setOpen(false);
                        }}
                      >
                        Clear
                      </button>
                      <button className="text-black/50 hover:text-black" onClick={() => setOpen(false)} aria-label="Minimise chat">
                        Close
                      </button>
                    </div>
                  </div>

                  <div ref={listRef} className="max-h-[min(56vh,520px)] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
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
                          <p className="max-w-[80%] rounded-[18px] bg-[#f0f0f0] px-4 py-2">{text}</p>
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
                            className="size-2 rounded-full bg-black/40"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    )}

                    {error && <p className="rounded-[14px] bg-[#f6f6f6] px-4 py-3 text-[15px] text-black/60">{errorText(error)}</p>}
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
                  <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-6">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => ask(s)}
                        className="rounded-full border border-black/15 px-4 py-1.5 text-[15px] transition-colors hover:border-black hover:bg-black hover:text-white"
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
              className="flex items-center gap-3 py-[10px] pl-5 pr-[10px] sm:pl-6"
            >
              <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor" aria-hidden="true">
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
                placeholder={messages.length ? "Ask a follow-up…" : "Ask anything — studios, jobs, stories…"}
                aria-label="Ask the assistant"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/40"
              />
              {!open && messages.length > 0 && (
                <button type="button" className="shrink-0 text-[15px] underline underline-offset-4 hover:opacity-60" onClick={() => setOpen(true)}>
                  Show chat
                </button>
              )}
              {busy ? (
                <button type="button" onClick={stop} className={pill}>
                  Stop
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()} className={pill}>
                  Ask
                </button>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
