"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { useCart } from "./Cart";
import { MotionArt } from "./MotionArt";
import { Price } from "./ProductCard";
import { easeExpo, Reveal, SplitText } from "./Reveal";

export function ProductView({ p }: { p: Product }) {
  const { add } = useCart();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string>();
  const [warn, setWarn] = useState(false);

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              animate={{ clipPath: "inset(0 0 0 0%)" }}
              transition={{ duration: 1, ease: easeExpo }}
            >
              <MotionArt seed={p.images[active]} word={p.name.split(/[_ ]/)[0]} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-3 flex gap-3">
          {p.images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/5] w-20 overflow-hidden bg-surface transition-opacity ${active === i ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
              aria-label={`Image ${i + 1}`}
            >
              <MotionArt seed={src} />
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-4 md:col-start-9">
        <div className="md:sticky md:top-32">
          <p className="text-sm uppercase tracking-[0.06em] text-muted">{p.category}</p>
          <SplitText text={p.name} className="mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1] tracking-[-0.01em]" />
          <Reveal delay={0.15}>
            <Price p={p} className="mt-4 block text-2xl" />
            <p className="mt-6 text-lg leading-relaxed text-fg/80">{p.description}</p>

            {p.sizes && (
              <div className="mt-8">
                <p className={`text-sm transition-colors ${warn ? "text-red-500" : "text-muted"}`}>
                  {warn ? "Please pick a size" : "Size"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setWarn(false);
                      }}
                      className={`size-12 rounded-full border text-sm transition-colors duration-300 ${
                        size === s ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => (p.sizes && !size ? setWarn(true) : add(p.slug, size))}
              className="mt-8 w-full rounded-full bg-fg py-4 text-lg text-bg"
            >
              Add to cart
            </motion.button>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
