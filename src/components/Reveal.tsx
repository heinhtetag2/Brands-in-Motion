"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

export const easeExpo = [0.19, 1, 0.22, 1] as const;

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number | string };

/**
 * Text/blocks entrance: rises smoothly from 36px below while fading in, on the expo-out curve,
 * as soon as it enters the screen. (Images keep the window-style wipe in FlexImage.)
 */
export function Reveal({ delay = 0, y = 36, children, ...rest }: Props) {
  return (
    <motion.div
      // Smooth rise: floats up from below into place while fading in
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: easeExpo, delay, opacity: { duration: 0.7, ease: "easeOut", delay } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** CSS "ease" curve, used by the reference site's card entrance */
export const easeCss = [0.25, 0.1, 0.25, 1] as const;

/**
 * Card entrance measured from the reference: starts 15px above and invisible, then drops into
 * place while fading in over exactly 1s ("ease"). Cards in a row start together (no stagger).
 */
export function CardReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: easeCss }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline entrance: each *line* rises as one piece from behind an invisible edge, with a small tilt
 * that straightens as it lands, and a short delay between lines. Lines are measured from the real layout
 * (and re-measured on resize), so it works at any width. The mask is padded, then pulled back with a
 * negative margin, so descenders (g, p, y) aren't cut off.
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const calc = () => {
      const out: string[] = [];
      let top = -1;
      el.querySelectorAll<HTMLElement>("[data-w]").forEach((w) => {
        const t = Math.round(w.getBoundingClientRect().top);
        if (out.length === 0 || Math.abs(t - top) > 4) {
          out.push(w.textContent ?? "");
          top = t;
        } else {
          out[out.length - 1] += ` ${w.textContent}`;
        }
      });
      setLines((prev) => (prev && prev.join("|") === out.join("|") ? prev : out));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    document.fonts?.ready.then(calc);
    return () => ro.disconnect();
  }, [text]);

  return (
    <Tag className={`relative ${className}`} aria-label={text}>
      {/* Invisible copy used only to find where the lines break */}
      <span ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-0">
        {words.map((w, i) => (
          <span key={i}>
            <span data-w>{w}</span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>

      {lines === null ? (
        // Before measuring: reserve the same space, invisible
        <span aria-hidden="true" className="opacity-0">
          {text}
        </span>
      ) : (
        lines.map((line, i) => (
          <span key={i} aria-hidden="true" className="-mb-[0.22em] block overflow-hidden pb-[0.22em]">
            <motion.span
              className="block whitespace-nowrap will-change-transform"
              style={{ transformOrigin: "0% 100%" }}
              initial={{ y: "108%", rotate: 3.5 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: easeExpo, delay: delay + i * 0.11 }}
            >
              {line}
            </motion.span>
          </span>
        ))
      )}
    </Tag>
  );
}

/**
 * Image entrance, matching the reference: a "window" that opens upward. The image starts clipped
 * to its bottom edge and the clip expands to the full frame (0.8s, expo-out) while fading in.
 */
export function FlexImage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
      whileInView={{ opacity: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: easeExpo }}
    >
      {children}
    </motion.div>
  );
}
