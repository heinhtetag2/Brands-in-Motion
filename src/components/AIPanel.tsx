"use client";

import { useChat } from "@ai-sdk/react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { site } from "@/lib/data";
import { errorText, Rich } from "./AskAI";
import { SelectionAsk } from "./SelectionAsk";
import { easeExpo } from "./Reveal";

const PANEL_W = 420;
/** Display name of the assistant */
export const LLM_NAME = `${site.name.replace(/\s+/g, "")}LLM`;
const suggestions = [`What does ${site.name} do?`, "What was the design process on your projects?", "How can we work together?"];

const Ctx = createContext<{ open: boolean; toggle: () => void; askAbout: (selected: string) => void } | null>(null);
export function useAIPanel() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAIPanel must be used inside AIPanelProvider");
  return c;
}

/** Holds the open state, shifts the page over on desktop, and renders the panel. */
export function AIPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // Text selected on the page: shown as a quote card above the input, then the visitor asks about it
  const [quote, setQuote] = useState<string | null>(null);

  // The page (and fixed header) read this to make room for the panel on desktop
  useEffect(() => {
    document.documentElement.style.setProperty("--ai-w", open ? `${PANEL_W}px` : "0px");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Ctx.Provider
      value={{
        open,
        toggle: () => setOpen((v) => !v),
        askAbout: (text) => {
          setQuote(text);
          setOpen(true);
        },
      }}
    >
      {children}
      <SelectionAsk />
      <AnimatePresence>{open && <Panel onClose={() => setOpen(false)} quote={quote} onClearQuote={() => setQuote(null)} />}</AnimatePresence>
    </Ctx.Provider>
  );
}

function Panel({ onClose, quote, onClearQuote }: { onClose: () => void; quote: string | null; onClearQuote: () => void }) {
  const { messages, sendMessage, status, stop, error, clearError, setMessages } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    if (error) clearError();
    // With a selected quote attached, the question is about that text
    sendMessage({ text: quote ? `${QUOTE_PREFIX}${quote}"\n\n${q}` : q });
    if (quote) onClearQuote();
    setInput("");
  };

  // A new selection arrives: focus the input so the visitor can type their question
  useEffect(() => {
    if (quote) inputRef.current?.focus();
  }, [quote]);

  const icon = "grid size-8 place-items-center rounded-full transition-colors hover:bg-surface";

  return (
    <motion.aside
      role="complementary"
      aria-label={LLM_NAME}
      className="fixed inset-y-0 right-0 z-[58] flex w-full flex-col border-l border-line bg-bg text-fg sm:w-[420px]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: easeExpo }}
    >
      <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-6">
        <p className="t-nav">{LLM_NAME}</p>
        <div className="flex items-center gap-1">
          <button
            className={icon}
            aria-label="Start over"
            onClick={() => {
              stop();
              setMessages([]);
              clearError();
            }}
          >
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" />
            </svg>
          </button>
          <button className={icon} aria-label="Close assistant" onClick={onClose}>
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={listRef} className="flex flex-1 flex-col overflow-y-auto px-6 pb-4">
        {messages.length === 0 ? (
          // Welcome + suggested questions, pinned to the bottom like the reference
          <div className="mt-auto pb-4">
            <motion.p
              className="t-h3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeExpo, delay: 0.25 }}
            >
              Hi, ask me anything about {site.name}.
            </motion.p>
            <ul className="mt-6 space-y-3">
              {suggestions.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: easeExpo, delay: 0.35 + i * 0.07 }}
                >
                  <button onClick={() => ask(s)} className="group flex items-start gap-2 text-left text-fg/70 transition-colors hover:text-fg">
                    <span aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:translate-x-1">
                      ↳
                    </span>
                    {s}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-auto space-y-4 pt-4">
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              return m.role === "user" ? (
                <motion.div
                  key={m.id}
                  className="flex justify-end"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: easeExpo }}
                >
                  <UserBubble text={text} />
                </motion.div>
              ) : (
                <AssistantMessage key={m.id} text={text} onAsk={ask} done={!busy || m.id !== messages.at(-1)?.id} />
              );
            })}
            {status === "submitted" && (
              <div className="flex gap-1.5 py-1" aria-label="Thinking">
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
            {error && <p className="rounded-[12px] bg-surface px-3.5 py-2.5 text-[15px] text-fg/70">{errorText(error)}</p>}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {quote && (
          <motion.div
            key="quote"
            className="shrink-0 overflow-hidden px-6"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeExpo }}
          >
            <div className="mb-2 flex items-start gap-3 bg-surface px-4 py-3 text-fg/70">
              <span aria-hidden="true" className="font-serif text-[28px] leading-[0.8]">“</span>
              <p className="line-clamp-3 min-w-0 flex-1 text-[15px] leading-[1.4]">{quote}</p>
              <button onClick={onClearQuote} className="shrink-0 text-fg/50 hover:text-fg" aria-label="Remove quote">
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="m-6 mt-0 flex shrink-0 items-center gap-2 bg-surface py-2 pl-4 pr-2"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={quote ? "Ask about this quote…" : `Ask about ${site.name}…`}
          aria-label={`Ask about ${site.name}`}
          className="min-w-0 flex-1 bg-transparent py-1.5 outline-none placeholder:text-fg/40"
        />
        {busy ? (
          <button type="button" onClick={stop} className={icon} aria-label="Stop">
            <span className="size-2.5 bg-fg" />
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()} className={`${icon} disabled:opacity-30`} aria-label="Send">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </button>
        )}
      </form>
    </motion.aside>
  );
}

/** Assistant reply: the answer, then any "You could also ask:" lines as clickable follow-ups. */
function AssistantMessage({ text, onAsk, done }: { text: string; onAsk: (q: string) => void; done: boolean }) {
  const [body, more] = text.split(/\n\nYou could also ask:\n/);
  const next = (more ?? "")
    .split("\n")
    .map((l) => l.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
  return (
    <motion.div className="leading-[1.45]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Rich text={body} onNavigate={() => {}} />
      {done && next.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {next.map((q, i) => (
            <motion.li
              key={q}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeExpo, delay: i * 0.06 }}
            >
              <button
                onClick={() => onAsk(q)}
                className="group flex items-start gap-2 text-left text-[15px] text-fg/60 transition-colors hover:text-fg"
              >
                <span aria-hidden="true" className="transition-transform duration-500 ease-expo group-hover:translate-x-1">
                  ↳
                </span>
                {q}
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

const QUOTE_PREFIX = 'Regarding: "';

/** A user message; when it carries a selected quote, show the quote card above the question. */
function UserBubble({ text }: { text: string }) {
  const m = text.match(/^Regarding: "([\s\S]*?)"\n\n([\s\S]*)$/);
  if (!m) return <p className="max-w-[85%] rounded-[16px] bg-surface px-3.5 py-2">{text}</p>;
  return (
    <div className="flex max-w-[90%] flex-col items-end gap-2">
      <div className="flex gap-3 bg-surface px-4 py-3 text-fg/60">
        <span aria-hidden="true" className="font-serif text-[28px] leading-[0.8]">“</span>
        <p className="line-clamp-4 text-[15px] leading-[1.4]">{m[1]}</p>
      </div>
      <p className="rounded-[16px] bg-surface px-3.5 py-2">{m[2]}</p>
    </div>
  );
}
