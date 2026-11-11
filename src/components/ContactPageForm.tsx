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

/**
 * Contact form. Submitting opens the visitor's email app with the message ready to send to
 * site.email. To deliver straight to an inbox instead, connect an email service and post to an API route.
 */
export function ContactPageForm() {
  const [sent, setSent] = useState(false);
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
          <p className="text-[clamp(1.8rem,3vw,2.8rem)]">Thanks, your email app should now be open.</p>
          <p className="mt-4 text-muted">
            If nothing opened, write to{" "}
            <a href={`mailto:${site.email}`} className="u-hover text-fg">
              {site.email}
            </a>
            .
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const get = (k: string) => String(f.get(k) ?? "").trim();
            const lines = [
              get("message"),
              "",
              `Name: ${get("name")}`,
              `Email: ${get("email")}`,
              get("company") && `Company: ${get("company")}`,
              get("website") && `Website: ${get("website")}`,
              picked.length > 0 && `Looking for: ${picked.join(", ")}`,
            ].filter((l) => l !== false);
            const subject = encodeURIComponent(`Project enquiry from ${get("name")}`);
            window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
            setSent(true);
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

          <Reveal>
            <button className="pill text-lg">
              Send message <span className="arrow">→</span>
            </button>
          </Reveal>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
