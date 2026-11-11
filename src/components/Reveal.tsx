"use client";

import { motion, type HTMLMotionProps } from "motion/react";

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
 * Headline entrance: each word slides up from behind a mask, one after another.
 * The mask is padded (and pulled back with a negative margin) so descenders aren't cut off.
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
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="-mb-[0.22em] inline-block overflow-hidden pb-[0.22em] align-top">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "115%", rotate: 4 }}
              whileInView={{ y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: easeExpo, delay: delay + i * 0.045 }}
              style={{ transformOrigin: "0% 100%" }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
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
