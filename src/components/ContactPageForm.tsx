"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/data";
import { easeExpo, Reveal } from "./Reveal";

const fields = [
  { name: "name", label: "Your name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company / studio", type: "text", required: false },
  { name: "website", label: "Website", type: "url", required: false },
] as const;

const needs = ["Product design", "Website", "Mobile app", "Design system", "Branding", "Something else"];

/** Contact form. Submitting posts to /api/contact, which emails site.email through Resend. */
export function ContactPageForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="done"
          className="max-w-[820px] pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeExpo }}
        >
          <p className="text-[clamp(1.8rem,3vw,2.8rem)]">Thanks, your message is on its way.</p>
          <p className="mt-4 text-muted">I read every message and will reply to your email soon.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (sending) return;
            const f = new FormData(e.currentTarget);
            setSending(true);
            setError("");
            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...Object.fromEntries(f), needs: picked }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) throw new Error(data.error ?? "Your message couldn't be sent. Please try again.");
              setSent(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Your message couldn't be sent. Please try again.");
            } finally {
              setSending(false);
            }
          }}
          className="grid max-w-[820px] gap-x-8 gap-y-7 pt-2 md:grid-cols-2"
        >
          {fields.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.05}>
              <label className="block">
                <span className="text-sm uppercase tracking-[0.06em] text-fg/65">
                  {f.label}
                  {!f.required && " (optional)"}
                </span>
                <input
                  required={f.required}
                  name={f.name}
                  type={f.type}
                  className="mt-2 w-full border-b border-fg/30 bg-transparent py-3 text-xl outline-none transition-colors focus:border-fg"
                />
              </label>
            </Reveal>
          ))}

          <Reveal className="md:col-span-2">
            <span className="text-sm uppercase tracking-[0.06em] text-fg/65">What do you need?</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {needs.map((x) => {
                const on = picked.includes(x);
                return (
                  <button
                    type="button"
                    key={x}
                    aria-pressed={on}
                    onClick={() => setPicked((p) => (on ? p.filter((y) => y !== x) : [...p, x]))}
                    className={`rounded-full border px-4 py-2 transition-colors duration-500 ${
                      on ? "border-fg bg-fg text-bg" : "border-fg/30 hover:border-fg"
                    }`}
                  >
                    {x}
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="md:col-span-2">
            <label className="block">
              <span className="text-sm uppercase tracking-[0.06em] text-fg/65">Tell me about the project</span>
              <textarea
                required
                name="message"
                rows={4}
                className="mt-2 w-full resize-none border-b border-fg/30 bg-transparent py-3 text-xl outline-none focus:border-fg"
              />
            </label>
          </Reveal>

          {/* Hidden from people; catches spam bots that fill every field. */}
          <input type="text" name="nickname" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

          {error && (
            <p role="alert" className="md:col-span-2 text-red-600">
              {error} You can also write to{" "}
              <a href={`mailto:${site.email}`} className="u-hover underline">
                {site.email}
              </a>
              .
            </p>
          )}

          <Reveal>
            <button className="pill text-lg" disabled={sending} aria-busy={sending}>
              <span className="inline-grid place-items-center [&>*]:[grid-area:1/1]">
                <span className={sending ? "invisible" : undefined}>
                  Send message <span className="arrow">→</span>
                </span>
                {sending && (
                  <span role="status" aria-label="Sending message" className="inline-flex gap-1">
                    {[0, 0.15, 0.3].map((d) => (
                      <motion.span
                        key={d}
                        className="size-[5px] rounded-full bg-current"
                        animate={{ y: [0, -4, 0, 0] }}
                        transition={{ duration: 1.1, delay: d, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.6, 1] }}
                      />
                    ))}
                  </span>
                )}
              </span>
            </button>
          </Reveal>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
