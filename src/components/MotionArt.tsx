"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Original looping motion graphics used in place of photos/videos.
 * The `seed` picks a style and palette, so each post always looks the same.
 * Loops pause when off-screen to keep scrolling smooth.
 */

const palettes = [
  ["#f1ebe0", "#1a1a1a", "#e2583e"],
  ["#0f0f12", "#e8e8e8", "#7c5cff"],
  ["#dfe7dc", "#123b2f", "#f2c14e"],
  ["#f6d6e0", "#2b1b3d", "#ff4f8b"],
  ["#e9eef5", "#0b2e59", "#4ea8ff"],
  ["#151515", "#f5f1e6", "#ffb238"],
  ["#f4f1ea", "#111111", "#2f6bff"],
  ["#2d4b3f", "#e9f0e6", "#c7f464"],
  ["#ffffff", "#0f0f0f", "#0f0f0f"],
  ["#c9c3b6", "#1d1d1b", "#f4f1ea"],
] as const;

const styles = ["type", "grid", "orbit", "bars", "blob", "checker", "stack", "dots"] as const;
export type ArtStyle = (typeof styles)[number];

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function MotionArt({
  seed,
  word,
  style,
  index,
  className = "",
}: {
  seed: string;
  /** Word used by the kinetic-type style */
  word?: string;
  style?: ArtStyle;
  /** Position in a list: when given, styles and palettes rotate in order so neighbours never match */
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const h = hash(seed);
  const [bg, fg, ac] = palettes[index !== undefined ? (index * 3) % palettes.length : h % palettes.length];
  const kind = style ?? styles[index !== undefined ? (index * 5) % styles.length : (h >>> 4) % styles.length];
  const speed = 0.8 + ((h >>> 8) % 5) * 0.15; // slight per-card tempo variation

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden ${visible ? "" : "ma-paused"} ${className}`}
      style={{ background: bg, color: fg, containerType: "size" }}
    >
      {kind === "type" && <TypeLoop word={word ?? "Motion"} fg={fg} ac={ac} speed={speed} />}
      {kind === "grid" && <GridLoop fg={fg} ac={ac} speed={speed} />}
      {kind === "orbit" && <OrbitLoop fg={fg} ac={ac} speed={speed} />}
      {kind === "bars" && <BarsLoop fg={fg} ac={ac} speed={speed} />}
      {kind === "blob" && <BlobLoop fg={fg} ac={ac} speed={speed} />}
      {kind === "checker" && <CheckerLoop fg={fg} ac={ac} speed={speed} word={word} />}
      {kind === "stack" && <StackLoop fg={fg} ac={ac} speed={speed} />}
      {kind === "dots" && <DotsLoop fg={fg} ac={ac} speed={speed} />}
    </div>
  );
}

type P = { fg: string; ac: string; speed: number };

function TypeLoop({ word, ac, speed }: P & { word: string }) {
  const row = (Array(6).fill(word) as string[]).join(" · ") + " · ";
  return (
    <div className="flex h-full flex-col justify-center gap-[2cqh] font-normal leading-none tracking-[-0.04em]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex w-max whitespace-nowrap text-[30cqh]"
          style={{
            animation: `${i % 2 ? "ma-marquee-r" : "ma-marquee"} ${14 / speed}s linear infinite`,
            color: i === 1 ? ac : undefined,
            fontStyle: i === 1 ? "italic" : undefined,
            fontFamily: i === 1 ? "var(--font-serif-italic)" : undefined,
          }}
        >
          <span>{row}</span>
          <span>{row}</span>
        </div>
      ))}
    </div>
  );
}

function GridLoop({ fg, ac, speed }: P) {
  return (
    <div className="grid h-full grid-cols-6 grid-rows-4 gap-[3cqw] p-[6cqw]">
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} className="flex items-center justify-center">
          <div
            className="aspect-square h-full max-w-full"
            style={{
              background: i % 5 === 0 ? ac : fg,
              borderRadius: "0 100% 0 0",
              animation: `ma-quarter ${6 / speed}s cubic-bezier(.7,0,.2,1) infinite`,
              animationDelay: `${-((i % 6) + Math.floor(i / 6)) * 0.18}s`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function OrbitLoop({ fg, ac, speed }: P) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute size-[22cqh] rounded-full" style={{ background: ac }} />
      {[44, 66, 88].map((d, i) => (
        <div
          key={d}
          className="absolute rounded-full border"
          style={{
            width: `${d}cqh`,
            height: `${d}cqh`,
            borderColor: fg,
            opacity: 0.5,
            animation: `ma-spin ${(8 + i * 4) / speed}s linear infinite ${i % 2 ? "reverse" : ""}`,
          }}
        >
          <span className="absolute left-1/2 top-0 size-[5cqh] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: fg }} />
        </div>
      ))}
    </div>
  );
}

function BarsLoop({ fg, ac, speed }: P) {
  return (
    <div className="flex h-full items-center gap-[1.6cqw] px-[8cqw]">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className="h-[70cqh] flex-1 rounded-full"
          style={{
            background: i === 7 ? ac : fg,
            animation: `ma-bars ${1.8 / speed}s ease-in-out infinite`,
            animationDelay: `${-i * 0.11}s`,
          }}
        />
      ))}
    </div>
  );
}

function BlobLoop({ fg, ac, speed }: P) {
  return (
    <>
      <div
        className="absolute left-[42%] top-1/2 size-[80cqh] opacity-90"
        style={{ background: ac, animation: `ma-morph ${10 / speed}s ease-in-out infinite` }}
      />
      <div
        className="absolute left-[60%] top-1/2 size-[55cqh] mix-blend-difference"
        style={{ background: fg, animation: `ma-morph ${7 / speed}s ease-in-out infinite reverse` }}
      />
    </>
  );
}

function CheckerLoop({ fg, ac, speed, word }: P & { word?: string }) {
  const letters = (word ?? "MOTION").replace(/[^a-z]/gi, "").toUpperCase().slice(0, 4).padEnd(4, "•");
  return (
    <div className="grid h-full grid-cols-6 grid-rows-4 [perspective:600px]">
      {Array.from({ length: 24 }, (_, i) => {
        const dark = (i + Math.floor(i / 6)) % 2 === 0;
        const letterAt = [7, 10, 13, 16].indexOf(i);
        return (
          <div
            key={i}
            className="flex items-center justify-center text-[14cqh] [transform-style:preserve-3d]"
            style={{
              background: dark ? fg : "transparent",
              color: dark ? ac : fg,
              animation: `ma-flip ${5 / speed}s cubic-bezier(.7,0,.2,1) infinite`,
              animationDelay: `${-(i % 6) * 0.12 - Math.floor(i / 6) * 0.2}s`,
            }}
          >
            {letterAt >= 0 ? letters[letterAt] : ""}
          </div>
        );
      })}
    </div>
  );
}

function StackLoop({ fg, ac, speed }: P) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: `${32 + i * 14}%`, animation: `ma-bob ${3 / speed}s ease-in-out infinite`, animationDelay: `${-i * 0.35}s` }}
        >
          <div
            className="size-[36cqh] border-2"
            style={{
              transform: "rotateX(60deg) rotateZ(45deg)",
              background: i === 1 ? ac : "transparent",
              borderColor: fg,
              opacity: 1 - i * 0.15,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function DotsLoop({ fg, ac, speed }: P) {
  return (
    <div className="grid h-full grid-cols-12 grid-rows-7 p-[4cqw]">
      {Array.from({ length: 84 }, (_, i) => {
        const x = i % 12;
        const y = Math.floor(i / 12);
        return (
          <div key={i} className="flex items-center justify-center">
            <span
              className="size-[6cqh] rounded-full"
              style={{
                background: (x + y) % 9 === 0 ? ac : fg,
                animation: `ma-pulse ${2.4 / speed}s ease-in-out infinite`,
                animationDelay: `${-(x + y) * 0.12}s`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
