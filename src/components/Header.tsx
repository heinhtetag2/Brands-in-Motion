"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useEffect, useState } from "react";
import { findMenu, site } from "@/lib/data";
import { useAIPanel } from "./AIPanel";
import { useCart } from "./Cart";
import { easeExpo } from "./Reveal";

const main = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/jobs", label: "Jobs", match: (p: string) => p.startsWith("/jobs") },
  { href: "/shop", label: "Shop", match: (p: string) => p.startsWith("/shop") },
];
// Nested menu (currently hidden): children are defined in lib/data.ts. Add a button that calls setFindOpen(true) to bring it back.
const find = findMenu;
// Top-level pages shown at the right of the desktop header: About, Works, Contact (the centred logo leaves no room in the nav row)
const about = {
  href: "/about",
  label: "About",
  match: (p: string) => p.startsWith("/about"),
};
// Project pages live under /resource, so they count as Works
const works = {
  href: "/works",
  label: "Works",
  match: (p: string) => p.startsWith("/works") || p.startsWith("/resource"),
};
const contact = {
  href: "/contact",
  label: "Contact",
  match: (p: string) => p.startsWith("/contact"),
};

// How many letters of the role the logo's "selection" runs into ("UI/UX De" of "UI/UX Designer")
const SELECTED = 8;

const DARK_ROUTES = ["/about"];

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const ai = useAIPanel();

  // Welcome tooltip for the AI button: shows a few seconds after every page load or refresh,
  // then hides itself (or when dismissed / the assistant is opened).
  const [tip, setTip] = useState(false);
  useEffect(() => {
    const show = setTimeout(() => setTip(true), 2000);
    const hide = setTimeout(() => setTip(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);
  const dismissTip = () => setTip(false);
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

  // Page-level theme (About is dark)
  useEffect(() => {
    document.documentElement.dataset.theme = DARK_ROUTES.some((r) =>
      pathname.startsWith(r),
    )
      ? "dark"
      : "light";
  }, [pathname]);

  // Close menus when the route changes (adjusting state during render)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setFindOpen(false);
    setMenuOpen(false);
  }

  const cls = "u-hover";

  const items = findOpen ? (
    <>
      <button onClick={() => setFindOpen(false)} className={cls}>
        Back
      </button>
      {find.map((f) => (
        <Link
          key={f.href}
          href={f.href}
          className={cls}
          data-active={pathname.startsWith(f.href)}
        >
          {f.label}
        </Link>
      ))}
    </>
  ) : (
    <>
      {main.slice(0, 1).map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={cls}
          data-active={m.match(pathname)}
        >
          {m.label}
        </Link>
      ))}
      {main.slice(1).map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className={cls}
          data-active={m.match(pathname)}
        >
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
          <svg
            viewBox="0 0 20 22"
            className="h-[19px] w-auto"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6 6V5a4 4 0 0 1 8 0v1h4l1 16H1L2 6h4Zm2 0h4V5a2 2 0 0 0-4 0v1Z" />
          </svg>
          {count > 0 && <span className="tabular-nums">{count}</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );

  // Sparkle button that opens the AI panel on the right
  const aiButton = (
    <div className="relative">
      <button
        onClick={() => {
          dismissTip();
          ai.toggle();
        }}
        title="Ask my AI"
        aria-label={ai.open ? "Close assistant" : "Ask the assistant"}
        aria-pressed={ai.open}
        className="group grid size-8 place-items-center"
      >
        {/* AI sparkle: one large four-point star with two small ones that twinkle on hover */}
        <svg
          viewBox="0 0 24 24"
          className="size-[22px]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            className="origin-[10px_13px] transition-transform duration-700 ease-expo group-hover:rotate-90 group-hover:scale-90"
            d="M10 4c.5 5.2 3.300 8.300 8.500 9-5.200.7-8 3.800-8.500 9-.5-5.200-3.300-8.300-8.500-9C6.700 12.300 9.500 9.200 10 4Z"
          />
          <path
            className="origin-[19px_5px] transition-transform duration-700 ease-expo group-hover:scale-125"
            d="M19 1.500c.2 2.100 1.400 3.300 3.500 3.500-2.100.2-3.300 1.400-3.500 3.500-.2-2.100-1.400-3.300-3.500-3.500 2.100-.2 3.300-1.400 3.500-3.500Z"
          />
          <path
            className="origin-[20px_19px] transition-transform duration-700 ease-expo group-hover:scale-0"
            d="M20 16.800c.1 1.300.9 2.100 2.200 2.200-1.300.1-2.100.9-2.200 2.200-.1-1.300-.9-2.100-2.200-2.200 1.300-.1 2.100-.9 2.200-2.200Z"
          />
        </svg>
        {/* Pulsing dot while the tooltip is pending */}
        {tip && !ai.open && (
          <span
            className="absolute right-[3px] top-[3px] flex size-2"
            aria-hidden="true"
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-fg opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-fg" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {tip && !ai.open && (
          <motion.div
            role="status"
            className="absolute right-[-6px] top-[calc(100%+14px)] z-[60] w-[250px] origin-top-right rounded-[16px] bg-fg px-4 py-3.5 text-[14px] leading-[1.35] text-bg max-md:w-[230px]"
            initial={{ opacity: 0, y: -8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.6, ease: easeExpo }}
          >
            {/* Pointer towards the icon */}
            <span
              className="absolute -top-[5px] right-[17px] size-[11px] rotate-45 rounded-[2px] bg-fg"
              aria-hidden="true"
            />
            <button
              onClick={() => dismissTip()}
              aria-label="Dismiss tip"
              className="absolute right-2 top-2 grid size-6 place-items-center opacity-60 transition-opacity hover:opacity-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-[14px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            <p className="pr-5 font-medium">Ask my AI ✦</p>
            <p className="mt-1 opacity-75">
              Curious about my work, skills or how to hire me? Ask here and get
              an answer straight away.
            </p>
            <button
              onClick={() => {
                dismissTip();
                ai.toggle();
              }}
              className="mt-2.5 underline underline-offset-[3px] transition-opacity hover:opacity-70"
            >
              Try it →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const logo = (
    <Link href="/" aria-label={`${site.name} — home`} className="block">
      <motion.span
        className="t-nav flex items-center whitespace-nowrap font-normal tracking-[-0.01em]"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeExpo, delay: 0.1 }}
      >
        {/* Like a text selection in progress: covers the name and runs into the first letters of the role */}
        <span className="relative py-[0.08em] pl-[0.22em] text-bg">
          <motion.span
            className="absolute inset-0 origin-left bg-fg"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: easeExpo, delay: 0.35 }}
          />
          <span className="relative whitespace-pre">
            {ai.open
              ? site.name
              : `${site.name} ${site.role.slice(0, SELECTED)}`}
          </span>
        </span>
        {/* While the AI panel is open the header is narrower, so the logo shows just the name */}
        {!ai.open && <span>{site.role.slice(SELECTED)}</span>}
      </motion.span>
    </Link>
  );

  // Mobile menu list: main links, or the "Find" sub-links
  type MobileLink = {
    key: string;
    label: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    chevron?: boolean;
  };
  const mobileLinks: MobileLink[] = findOpen
    ? [
        { key: "back", label: "Back", onClick: () => setFindOpen(false) },
        ...find.map((f) => ({
          key: f.href,
          label: f.label,
          href: f.href,
          active: pathname.startsWith(f.href),
        })),
      ]
    : [
        ...main.slice(0, 1).map((m) => ({
          key: m.href,
          label: m.label,
          href: m.href,
          active: m.match(pathname),
        })),
        {
          key: about.href,
          label: about.label,
          href: about.href,
          active: about.match(pathname),
        },
        {
          key: works.href,
          label: works.label,
          href: works.href,
          active: works.match(pathname),
        },
        ...main.slice(1).map((m) => ({
          key: m.href,
          label: m.label,
          href: m.href,
          active: m.match(pathname),
        })),
        {
          key: contact.href,
          label: contact.label,
          href: contact.href,
          active: contact.match(pathname),
        },
      ];

  return (
    <>
      <motion.header
        className={`ai-shift fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled && !menuOpen ? "bg-bg" : ""}`}
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.6, ease: easeExpo }}
      >
        {/* Desktop: one-line nav left, logo centre, cart right */}
        <div className="gutter hidden h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center xl:grid">
          <nav className="t-nav whitespace-nowrap" aria-label="Main">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={findOpen ? "find" : "main"}
                className={`flex flex-nowrap transition-[gap] duration-500 [&>*]:py-[0.1em] ${ai.open ? "gap-x-[18px]" : "gap-x-[34px]"}`}
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
          <div
            className={`t-nav flex items-center justify-self-end transition-[gap] duration-500 ${ai.open ? "gap-[18px]" : "gap-[34px]"}`}
          >
            {[about, works, contact].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="u-hover py-[0.1em]"
                data-active={l.match(pathname)}
              >
                {l.label}
              </Link>
            ))}
            {cartButton}
            {aiButton}
          </div>
        </div>

        {/* Phones + tablets: logo left, thin "+" right that turns into "×" */}
        <div className="gutter flex h-[var(--header-h)] items-center justify-between xl:hidden">
          {logo}
          <div className="flex items-center gap-4">
            {cartButton}
            {aiButton}
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
                    transition={{
                      duration: 0.7,
                      ease: easeExpo,
                      delay: 0.05 + i * 0.04,
                    }}
                  >
                    {l.href ? (
                      <Link
                        href={l.href}
                        className="u-hover"
                        data-active={l.active}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <button
                        onClick={l.onClick}
                        className="u-hover flex items-center gap-3"
                        data-active={l.active ?? false}
                      >
                        {l.key === "back" && (
                          <svg
                            viewBox="0 0 24 24"
                            className="size-[0.6em]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            aria-hidden="true"
                          >
                            <path d="M15 4 7 12l8 8" />
                          </svg>
                        )}
                        {l.label}
                        {l.chevron && (
                          <svg
                            viewBox="0 0 24 24"
                            className="size-[0.6em]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            aria-hidden="true"
                          >
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
