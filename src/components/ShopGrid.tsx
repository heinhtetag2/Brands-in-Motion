"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const cats = ["All", "Merch", "Scripts"] as const;

export function ShopGrid({ products }: { products: Product[] }) {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="mt-[5px] flex flex-col gap-10 md:flex-row md:gap-0">
      <aside className="md:w-[19.8%] md:shrink-0">
        <ul className="flex gap-6 md:sticky md:top-32 md:block md:space-y-[6px]">
          {cats.map((c) => (
            <li key={c}>
              <button onClick={() => setCat(c)} className={cat === c ? "font-bold" : "hover:opacity-60"}>
                {c}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <motion.div layout className="grid flex-1 gap-x-[49px] gap-y-[110px] sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} index={products.indexOf(p) + 3} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
