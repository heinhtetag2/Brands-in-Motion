"use client";

import { motion, type HTMLMotionProps } from "motion/react";

export const easeExpo = [0.19, 1, 0.22, 1] as const;

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number | string };

/**
 * Text/blocks entrance, matching the reference ("flex" style): fades in while rising 2vh,
 * 0.8s on the expo-out curve, as soon as it enters the screen.
 */
export function Reveal({ delay = 0, y = "2vh", children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: easeExpo, delay }}
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

/** Splits text into words that slide up from a mask, one after another. */
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
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-top" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeExpo, delay: delay + i * 0.045 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
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
