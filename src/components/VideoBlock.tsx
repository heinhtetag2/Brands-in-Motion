"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { MotionArt, type ArtStyle } from "./MotionArt";
import { easeExpo } from "./Reveal";

/**
 * Stand-in for an embedded showreel: poster image with a round play button.
 * Swap the inner <Image> for a <video> or Vimeo iframe when you have real footage.
 */
export function VideoBlock({
  src,
  ratio = "16 / 9",
  caption,
  word,
  style,
}: {
  src: string;
  ratio?: string;
  caption?: string;
  word?: string;
  style?: ArtStyle;
}) {
  const [playing, setPlaying] = useState(true);
  return (
    <figure>
      <motion.button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="group relative block w-full overflow-hidden bg-black"
        style={{ aspectRatio: ratio }}
        // Same "window opens upward" entrance as the reference's images
        initial={{ opacity: 0, clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" }}
        whileInView={{ opacity: 1, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeExpo }}
        aria-label={playing ? "Pause" : "Play"}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: easeExpo }}
        >
          <MotionArt seed={src} word={word} style={style} className={playing ? "" : "ma-paused"} />
        </motion.div>
        <span
          className={`absolute left-1/2 top-1/2 flex size-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-[opacity,transform] duration-500 group-hover:scale-105 max-md:size-16 ${
            playing ? "opacity-0 group-hover:opacity-100" : ""
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="size-8 fill-current max-md:size-5"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-1 size-8 fill-current max-md:size-5"><path d="M7 4v16l13-8z" /></svg>
          )}
        </span>
      </motion.button>
      {caption && <figcaption className="mt-[18px]">{caption}</figcaption>}
    </figure>
  );
}
