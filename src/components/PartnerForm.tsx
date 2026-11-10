"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { easeExpo, Reveal } from "./Reveal";

const fields = [
  { name: "name", label: "Your name", type: "text" },
  { name: "agency", label: "Agency / studio", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "website", label: "Website", type: "url" },
];
const interests = ["Sponsored feature", "Hiring", "Directory listing", "Collaboration"];

export function PartnerForm() {
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.p
          key="done"
          className="border-t border-line pt-10 text-[clamp(1.8rem,3vw,2.8rem)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeExpo }}
        >
          Thanks — we&rsquo;ll be in touch soon.
        </motion.p>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="grid gap-x-10 gap-y-8 border-t border-line pt-10 md:grid-cols-2"
        >
          {fields.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.05}>
              <label className="block">
                <span className="text-sm uppercase tracking-[0.06em] text-muted">{f.label}</span>
                <input
                  required={f.name !== "website"}
                  name={f.name}
                  type={f.type}
                  className="mt-2 w-full border-b border-line bg-transparent py-3 text-xl outline-none transition-colors focus:border-fg"
                />
              </label>
            </Reveal>
          ))}
          <Reveal className="md:col-span-2">
            <span className="text-sm uppercase tracking-[0.06em] text-muted">Interested in</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {interests.map((x) => {
                const on = picked.includes(x);
                return (
                  <button
                    type="button"
                    key={x}
                    onClick={() => setPicked((p) => (on ? p.filter((y) => y !== x) : [...p, x]))}
                    className={`rounded-full border px-4 py-2 transition-colors duration-500 ${
                      on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
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
              <span className="text-sm uppercase tracking-[0.06em] text-muted">Message</span>
              <textarea
                rows={4}
                className="mt-2 w-full resize-none border-b border-line bg-transparent py-3 text-xl outline-none focus:border-fg"
              />
            </label>
          </Reveal>
          <Reveal>
            <button className="pill text-lg">
              Send enquiry <span className="arrow">→</span>
            </button>
          </Reveal>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
