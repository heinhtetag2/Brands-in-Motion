"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, money } from "@/lib/data";
import { MotionArt } from "./MotionArt";
import { easeExpo } from "./Reveal";

type Line = { slug: string; size?: string; qty: number };
type CartCtx = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, size?: string) => void;
  setQty: (slug: string, size: string | undefined, qty: number) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "mi-cart";

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

const unitPrice = (slug: string) => {
  const p = getProduct(slug);
  return p ? (p.salePrice ?? p.price) : 0;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (saved) setLines(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add = useCallback((slug: string, size?: string) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.slug === slug && l.size === size);
      return hit
        ? ls.map((l) => (l === hit ? { ...l, qty: l.qty + 1 } : l))
        : [...ls, { slug, size, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, size: string | undefined, qty: number) => {
    setLines((ls) =>
      qty <= 0
        ? ls.filter((l) => !(l.slug === slug && l.size === size))
        : ls.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)),
    );
  }, []);

  const value = useMemo(
    () => ({
      lines,
      open,
      setOpen,
      add,
      setQty,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * unitPrice(l.slug), 0),
    }),
    [lines, open, add, setQty],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

function CartDrawer() {
  const { lines, open, setOpen, total, setQty } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Cart"
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-bg text-fg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: easeExpo }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-6">
              <p className="text-2xl">Cart</p>
              <button onClick={() => setOpen(false)} className="link-draw text-lg">
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <p className="py-10 text-lg text-muted">Your cart is empty.</p>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => {
                      const p = getProduct(l.slug);
                      if (!p) return null;
                      return (
                        <motion.li
                          key={l.slug + l.size}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: easeExpo }}
                          className="overflow-hidden border-b border-line"
                        >
                          <div className="flex gap-4 py-5">
                            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface">
                              <MotionArt seed={p.images[0]} />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <Link href={`/shop/${p.slug}`} onClick={() => setOpen(false)} className="text-lg leading-tight">
                                {p.name}
                              </Link>
                              {l.size && <p className="text-sm text-muted">Size {l.size}</p>}
                              <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-3 rounded-full border border-line px-3 py-1 text-sm">
                                  <button aria-label="Decrease" onClick={() => setQty(l.slug, l.size, l.qty - 1)}>−</button>
                                  <span className="w-4 text-center tabular-nums">{l.qty}</span>
                                  <button aria-label="Increase" onClick={() => setQty(l.slug, l.size, l.qty + 1)}>+</button>
                                </div>
                                <span className="tabular-nums">{money(l.qty * (p.salePrice ?? p.price))}</span>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            <div className="border-t border-line px-6 py-6">
              <div className="mb-5 flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="tabular-nums">{money(total)}</span>
              </div>
              <button
                disabled={!lines.length}
                className="w-full rounded-full bg-fg py-4 text-bg transition-opacity disabled:opacity-30"
              >
                Checkout
              </button>
              <p className="mt-3 text-center text-xs text-muted">Checkout is a demo — connect Stripe or Shopify to go live.</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
