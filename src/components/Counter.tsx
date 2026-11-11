"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { easeExpo } from "./Reveal";

/**
 * Odometer-style number: when scrolled into view, each digit rolls up through 0–9 and settles
 * on its value (left digit first), then the suffix fades in.
 */
export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const chars = to.toFixed(decimals).split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let seen = 0;

  return (
    <span ref={ref} className="inline-flex tabular-nums" aria-label={`${to.toFixed(decimals)}${suffix}`}>
      {chars.map((c, i) => {
        if (!/\d/.test(c)) return <span key={i} aria-hidden="true">{c}</span>;
        const n = Number(c);
        const order = seen++;
        // Later digits spin an extra lap so they keep moving while earlier ones settle
        const laps = order;
        const steps = laps * 10 + n;
        return (
          <span key={i} aria-hidden="true" className="relative inline-block h-[1em] overflow-hidden leading-none">
            <motion.span
              className="block"
              initial={{ y: "0em" }}
              animate={inView ? { y: `-${steps}em` } : { y: "0em" }}
              transition={{ duration: 1.6 + order * 0.25, ease: easeExpo, delay: 0.1 + order * 0.08 }}
            >
              {Array.from({ length: steps + 1 }, (_, k) => (
                <span key={k} className="block h-[1em]">
                  {k % 10}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
      {suffix && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.8, ease: easeExpo, delay: 0.9 + digitCount * 0.2 }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}
