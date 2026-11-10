"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/data";
import { useCart } from "./Cart";
import { easeExpo } from "./Reveal";

const main = [
  { href: "/", label: "Resource", match: (p: string) => p === "/" || p.startsWith("/resource") },
  { href: "/information", label: "Information", match: (p: string) => p.startsWith("/information") },
  { href: "/jobs", label: "Jobs", match: (p: string) => p.startsWith("/jobs") },
  { href: "/shop", label: "Shop", match: (p: string) => p.startsWith("/shop") },
];
const find = [
  { href: "/directory", label: "Talent" },
  { href: "/partner", label: "Agency Partner" },
];

const DARK_ROUTES = ["/information"];

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [findOpen, setFindOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const showCart = pathname.startsWith("/shop") || count > 0;

  // Hide on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 120 && !menuOpen);
    setScrolled(y > 40);
  });

  // Page-level theme (Information is dark)
  useEffect(() => {
    document.documentElement.dataset.theme = DARK_ROUTES.some((r) => pathname.startsWith(r)) ? "dark" : "light";
  }, [pathname]);

  // Close menus when the route changes (adjusting state during render)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setFindOpen(false);
    setMenuOpen(false);
  }

  const findActive = find.some((f) => pathname.startsWith(f.href));
  const cls = "u-hover";

  const items = findOpen ? (
    <>
      <button onClick={() => setFindOpen(false)} className={cls}>
        Back
      </button>
      {find.map((f) => (
        <Link key={f.href} href={f.href} className={cls} data-active={pathname.startsWith(f.href)}>
          {f.label}
        </Link>
      ))}
    </>
  ) : (
    <>
      {main.slice(0, 2).map((m) => (
        <Link key={m.href} href={m.href} className={cls} data-active={m.match(pathname)}>
          {m.label}
        </Link>
      ))}
      <button onClick={() => setFindOpen(true)} className={cls} data-active={findActive}>
        Find +
      </button>
      {main.slice(2).map((m) => (
        <Link key={m.href} href={m.href} className={cls} data-active={m.match(pathname)}>
          {m.label}
        </Link>
      ))}
    </>
  );

  const cartButton = (
    <AnimatePresence>
      {showCart && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(true)}
          className="t-nav flex items-center gap-2"
          aria-label={`Open cart, ${count} items`}
        >
          <svg viewBox="0 0 20 22" className="h-[19px] w-auto" fill="currentColor" aria-hidden="true">
            <path d="M6 6V5a4 4 0 0 1 8 0v1h4l1 16H1L2 6h4Zm2 0h4V5a2 2 0 0 0-4 0v1Z" />
          </svg>
          {count > 0 && <span className="tabular-nums">{count}</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );

  const logo = (
    <Link href="/" aria-label={`${site.name} — home`} className="block">
      <motion.span
        className="t-nav block whitespace-nowrap font-normal tracking-[-0.01em]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeExpo, delay: 0.1 }}
      >
        {site.name}
      </motion.span>
    </Link>
  );

  // Mobile menu list: main links, or the "Find" sub-links
  type MobileLink = { key: string; label: string; href?: string; onClick?: () => void; active?: boolean; chevron?: boolean };
  const mobileLinks: MobileLink[] = findOpen
    ? [
        { key: "back", label: "Back", onClick: () => setFindOpen(false) },
        ...find.map((f) => ({ key: f.href, label: f.label, href: f.href, active: pathname.startsWith(f.href) })),
      ]
    : [
        ...main.slice(0, 2).map((m) => ({ key: m.href, label: m.label, href: m.href, active: m.match(pathname) })),
        { key: "find", label: "Find +", onClick: () => setFindOpen(true), chevron: true, active: findActive },
        ...main.slice(2).map((m) => ({ key: m.href, label: m.label, href: m.href, active: m.match(pathname) })),
      ];

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled && !menuOpen ? "bg-bg" : ""}`}
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.6, ease: easeExpo }}
      >
        {/* Desktop: one-line nav left, logo centre, cart right */}
        <div className="gutter hidden h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center xl:grid">
          <nav className="t-nav whitespace-nowrap" aria-label="Main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={findOpen ? "find" : "main"}
                className="flex flex-nowrap gap-x-[34px] [&>*]:py-[0.1em]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: easeExpo }}
              >
                {items}
              </motion.div>
            </AnimatePresence>
          </nav>
          {logo}
          <div className="justify-self-end">{cartButton}</div>
        </div>

        {/* Phones + tablets: logo left, thin "+" right that turns into "×" */}
        <div className="gutter flex h-[var(--header-h)] items-center justify-between xl:hidden">
          {logo}
          <div className="flex items-center gap-5">
            {cartButton}
            <button
              onClick={() => {
                setMenuOpen((v) => !v);
                setFindOpen(false);
              }}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-1 grid size-9 place-items-center"
            >
              <motion.svg
                viewBox="0 0 24 24"
                className="size-[26px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                animate={{ rotate: menuOpen ? 45 : 0 }}
                transition={{ duration: 0.5, ease: easeExpo }}
                aria-hidden="true"
              >
                <path d="M12 1v22M1 12h22" />
              </motion.svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu: big left-aligned links */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="gutter fixed inset-0 z-40 flex flex-col bg-bg pb-[18vh] pt-[calc(var(--header-h)+30vh)] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={findOpen ? "find" : "main"}
                className="space-y-[0.28em] text-[clamp(2rem,8.6vw,3rem)] leading-[1.15] tracking-[-0.01em]"
                initial={{ opacity: 0, x: findOpen ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: findOpen ? -24 : 24 }}
                transition={{ duration: 0.45, ease: easeExpo }}
              >
                {mobileLinks.map((l, i) => (
                  <motion.li
                    key={l.key}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: easeExpo, delay: 0.05 + i * 0.04 }}
                  >
                    {l.href ? (
                      <Link href={l.href} className="u-hover" data-active={l.active}>
                        {l.label}
                      </Link>
                    ) : (
                      <button onClick={l.onClick} className="u-hover flex items-center gap-3" data-active={l.active ?? false}>
                        {l.key === "back" && (
                          <svg viewBox="0 0 24 24" className="size-[0.6em]" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                            <path d="M15 4 7 12l8 8" />
                          </svg>
                        )}
                        {l.label}
                        {l.chevron && (
                          <svg viewBox="0 0 24 24" className="size-[0.6em]" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                            <path d="m9 4 8 8-8 8" />
                          </svg>
                        )}
                      </button>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
