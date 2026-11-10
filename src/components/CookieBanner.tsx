"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { easeExpo } from "./Reveal";

const KEY = "mi-cookies";
// Testing: show the bar on every page load even after a choice was saved. Set to false before launch.
const ALWAYS_SHOW = true;

type Prefs = { analytics: boolean; marketing: boolean };

const options: Array<{ key: keyof Prefs | "necessary"; label: string }> = [
  { key: "necessary", label: "Necessary" },
  { key: "analytics", label: "Analytics" },
  { key: "marketing", label: "Marketing" },
];

/** Compact floating cookie bar in the site's own style (page colours, light type, outline pills). */
export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });

  useEffect(() => {
    let seen = "1";
    try {
      seen = localStorage.getItem(KEY) ?? "";
    } catch {}
    const t = setTimeout(() => setShow(ALWAYS_SHOW || !seen), 1000);
    return () => clearTimeout(t);
  }, []);

  const save = (p: Prefs) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {}
    setShow(false);
  };

  const pill = "rounded-full border border-fg px-[14px] py-[5px] leading-none transition-colors duration-300";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          className="pointer-events-none fixed inset-x-0 bottom-4 z-[55] flex justify-center px-3"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <motion.div
            layout
            transition={{ duration: 0.45, ease: easeExpo }}
            className="pointer-events-auto w-full max-w-[520px] overflow-hidden rounded-[18px] border border-line bg-bg text-[15px] text-fg shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          >
            <AnimatePresence initial={false}>
              {manage && (
                <motion.ul
                  key="prefs"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: easeExpo }}
                  className="overflow-hidden px-4"
                >
                  {options.map((o) => {
                    const locked = o.key === "necessary";
                    const on = locked || prefs[o.key as keyof Prefs];
                    return (
                      <li key={o.key} className="flex items-center justify-between border-b border-line py-[9px] first:pt-3">
                        <span>
                          {o.label}
                          {locked && <span className="text-muted"> · always on</span>}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={on}
                          aria-label={o.label}
                          disabled={locked}
                          onClick={() => setPrefs((p) => ({ ...p, [o.key]: !p[o.key as keyof Prefs] }))}
                          className={`relative h-[18px] w-[32px] shrink-0 rounded-full border border-fg transition-colors duration-300 disabled:opacity-40 ${
                            on ? "bg-fg" : "bg-transparent"
                          }`}
                        >
                          <motion.span
                            className={`absolute top-[2px] size-3 rounded-full ${on ? "bg-bg" : "bg-fg"}`}
                            animate={{ left: on ? 16 : 2 }}
                            transition={{ duration: 0.3, ease: easeExpo }}
                          />
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 py-2 pl-4 pr-2 max-sm:flex-wrap">
              <p className="mr-auto">We use cookies.</p>
              <button className="u-hover" onClick={() => (manage ? save(prefs) : setManage(true))}>
                {manage ? "Save" : "Preferences"}
              </button>
              <div className="flex gap-1.5">
                <button className={`${pill} hover:bg-fg hover:text-bg`} onClick={() => save({ analytics: false, marketing: false })}>
                  Reject
                </button>
                <button className={`${pill} bg-fg text-bg hover:opacity-80`} onClick={() => save({ analytics: true, marketing: true })}>
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
