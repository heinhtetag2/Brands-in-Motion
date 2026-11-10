"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { money, type Product } from "@/lib/data";
import { useCart } from "./Cart";
import { MotionArt } from "./MotionArt";
import { easeCss, FlexImage } from "./Reveal";

export function Price({
  p,
  className = "",
}: {
  p: Product;
  className?: string;
}) {
  return p.salePrice ? (
    <span className={className}>
      <span className="sr-only">Sale price: </span>
      {money(p.salePrice)} <span className="sr-only">Original price: </span>
      <s className="ml-2">{money(p.price)}</s>
    </span>
  ) : (
    <span className={className}>{money(p.price)}</span>
  );
}

export function ProductCard({ p, index }: { p: Product; index?: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: easeCss }}
      className="group flex flex-col"
    >
      <FlexImage>
        <Link
          href={`/shop/${p.slug}`}
          className="relative block aspect-square overflow-hidden bg-surface"
        >
          <MotionArt
            seed={p.images[0]}
            word={p.name.split(/[_ ]/)[0]}
            index={index}
          />
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
            <MotionArt
              seed={p.images[1]}
              word={p.name.split(/[_ ]/)[0]}
              index={index === undefined ? undefined : index + 4}
            />
          </div>
        </Link>
      </FlexImage>
      <div className="min-h-[122px] pt-[31px]">
        <Link href={`/shop/${p.slug}`} className="t-lg block leading-[1.1]">
          <span className="u-hover">{p.name}</span>
        </Link>
        <p className="mt-[10px] leading-[1.1]">
          <Price p={p} />
        </p>
        {p.salePrice && <p className="mt-[3px] text-muted">Sale</p>}
      </div>
      <button
        onClick={() => {
          if (p.sizes) return router.push(`/shop/${p.slug}`);
          add(p.slug);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="pill mt-auto h-[55px] w-full !py-0 !text-lg"
      >
        {added ? "Added!" : p.sizes ? "Select Size" : "Add To Cart"}
      </button>
    </motion.div>
  );
}
