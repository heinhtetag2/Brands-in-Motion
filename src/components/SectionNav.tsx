"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { easeExpo } from "./Reveal";

export type SectionItem = { id: string; label: string };

/**
 * Minimal section tracker pinned to the left edge: one thin horizontal line per section.
 * The current section's line grows and darkens; hovering a line shows the section name; click scrolls to it.
 */
export function SectionNav({ items }: { items: SectionItem[] }) {
  const [active, setActive] = useState(-1);
  // How far you've read through the current section (0 to 1); fills its line
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      // Active = the last section whose top has passed 40% of the viewport
      const line = window.innerHeight * 0.4;
      let current = -1;
      let amount = 0;
      items.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= line) {
          current = i;
          amount = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
        }
      });
      setActive(current);
      setProgress(amount);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <AnimatePresence>
      {active >= 0 && (
        <motion.nav
          aria-label="Sections"
          className="fixed left-[calc(4vw-6px)] top-1/2 z-30 hidden -translate-y-1/2 xl:block"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <ul className="flex flex-col">
            {items.map((it, i) => {
              const on = i === active;
              return (
                <li key={it.id} className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    onClick={() => document.getElementById(it.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    aria-label={it.label}
                    aria-current={on ? "true" : undefined}
                    className="flex h-[20px] w-14 items-center"
                  >
                    {/* Line: grows toward the hovered one (dock-style), active one fills as you read */}
                    <motion.span
                      className="relative block overflow-hidden rounded-full bg-fg/25"
                      animate={{
                        width: hover !== null ? [14, 30, 22, 18][Math.min(3, Math.abs(i - hover))] + (on ? 6 : 0) : on ? 32 : 14,
                        height: on || hover === i ? 2 : 1,
                      }}
                      transition={{ duration: 0.35, ease: easeExpo }}
                    >
                      <span
                        className="absolute inset-y-0 left-0 bg-fg transition-[width] duration-300 ease-out"
                        style={{ width: on ? `${Math.max(progress, 0.08) * 100}%` : hover === i ? "100%" : i < active ? "100%" : "0%" }}
                      />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {hover === i && (
                      <motion.span
                        className="pointer-events-none absolute left-14 top-1/2 max-w-[280px] -translate-y-1/2 truncate whitespace-nowrap rounded-full bg-fg px-3 py-[7px] text-[13px] leading-none text-bg"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: easeExpo }}
                      >
                        {it.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
