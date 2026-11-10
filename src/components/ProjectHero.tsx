"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MotionArt } from "./MotionArt";
import { easeExpo } from "./Reveal";

/**
 * Full-bleed project banner: fills the screen width and the height left under the header,
 * with a large two-line title pinned bottom-left (client on top, project name below).
 */
export function ProjectHero({ seed, word, client, title }: { seed: string; word: string; client: string; title: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Slow parallax on the artwork and a gentle fade on the title as you scroll past
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const line = (text: string, delay: number, className: string) => (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: easeExpo, delay }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={ref}
      // Pull up to sit right under the header, and break out of the page gutter to full width
      className="relative -mx-[4vw] -mt-[40px] h-[calc(100svh-var(--header-h))] min-h-[420px] overflow-hidden max-xl:-mt-[35px]"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: artY }}
        // Window-style wipe up from the bottom edge (as on the reference), with a slow settle
        initial={{ scale: 1.08, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
        animate={{ scale: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        transition={{ duration: 1.6, ease: easeExpo, clipPath: { duration: 0.8, ease: easeExpo } }}
      >
        <MotionArt seed={seed} word={word} />
      </motion.div>

      {/* Soft shade at the bottom so the title stays readable on any artwork */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

      <motion.h1
        style={{ opacity: titleOpacity }}
        className="gutter absolute inset-x-0 bottom-[2.6vw] text-[clamp(2.6rem,6.9vw,8.5rem)] leading-[1.02] tracking-[-0.02em] text-white max-md:bottom-6"
      >
        {line(client, 0.25, "text-white/65")}
        {line(title, 0.35, "")}
      </motion.h1>
    </section>
  );
}
