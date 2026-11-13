"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { LLM_NAME, useAIPanel } from "./AIPanel";
import { easeExpo } from "./Reveal";

type Pos = { x: number; y: number; below: boolean; text: string };

/** Floating "Ask AI" chip that appears next to any text you select on the page. */
export function SelectionAsk() {
  const { askAbout } = useAIPanel();
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    const read = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return setPos(null);
      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (text.length < 3 || text.length > 600) return setPos(null);
      // Ignore selections inside fields and inside the AI panel itself
      const node = sel.anchorNode instanceof Element ? sel.anchorNode : sel.anchorNode?.parentElement;
      if (!node || node.closest("input, textarea, [role=complementary], [data-no-ask]")) return setPos(null);
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height) return setPos(null);
      const below = rect.top < 70;
      setPos({
        x: Math.min(Math.max(rect.left + rect.width / 2, 70), window.innerWidth - 70),
        y: below ? rect.bottom + 10 : rect.top - 10,
        below,
        text,
      });
    };
    let t: ReturnType<typeof setTimeout>;
    const soon = () => {
      clearTimeout(t);
      t = setTimeout(read, 120);
    };
    document.addEventListener("selectionchange", soon);
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      clearTimeout(t);
      document.removeEventListener("selectionchange", soon);
      window.removeEventListener("scroll", read);
    };
  }, []);

  return (
    <AnimatePresence>
      {pos && (
        <motion.button
          type="button"
          key="ask-selection"
          // Keep the selection alive while clicking
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            askAbout(pos.text);
            window.getSelection()?.removeAllRanges();
            setPos(null);
          }}
          className="fixed z-[57] flex items-center gap-2 rounded-full bg-fg px-4 py-[9px] text-[14px] leading-none text-bg shadow-[0_6px_20px_rgba(0,0,0,0.18)]"
          style={{ left: pos.x, top: pos.y, translateX: "-50%", translateY: pos.below ? "0%" : "-100%" }}
          initial={{ opacity: 0, scale: 0.9, y: pos.below ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: easeExpo }}
        >
          <svg viewBox="0 0 24 24" className="size-[14px]" fill="currentColor" aria-hidden="true">
            <path d="M12 2c.4 4.6 2.4 6.6 7 7-4.6.4-6.6 2.4-7 7-.4-4.6-2.4-6.6-7-7 4.6-.4 6.6-2.4 7-7Zm7 11c.2 2.3 1.2 3.3 3.5 3.5-2.3.2-3.3 1.2-3.5 3.5-.2-2.3-1.2-3.3-3.5-3.5 2.3-.2 3.3-1.2 3.5-3.5Z" />
          </svg>
          Ask {LLM_NAME}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
