"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Job } from "@/lib/data";
import { MotionArt } from "./MotionArt";
import { easeCss, easeExpo, FlexImage } from "./Reveal";

type Key = "level" | "type" | "mode";
const groups: Array<{ key: Key; label: string; options: string[] }> = [
  { key: "level", label: "Experience Level", options: ["Junior", "Midweight", "Senior", "Director"] },
  { key: "type", label: "Job type", options: ["Full Time", "Freelance", "Contract"] },
  { key: "mode", label: "On-site/Remote", options: ["On-site", "Remote", "Hybrid"] },
];

const chip = "rounded-full border border-black/15 bg-chip text-black";

/** Pill that opens a checkbox panel (multi-select), with a count badge — as on the reference. */
function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`${chip} flex items-center gap-2 px-[22px] py-[14px] text-base font-medium`}
        aria-expanded={open}
      >
        {label}
        {value.length > 0 ? (
          <span className="ml-1 inline-flex size-[22px] items-center justify-center rounded-full bg-black text-xs text-white">
            {value.length}
          </span>
        ) : (
          <span className="text-xs opacity-60">▾</span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-[112%] z-20 min-w-[240px] rounded-[18px] bg-chip p-5 text-black shadow-[0_10px_30px_rgba(0,0,0,.12)]"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: easeExpo }}
          >
            <button onClick={() => setOpen(false)} className="absolute right-[14px] top-3 text-xl opacity-60" aria-label="Close">
              ×
            </button>
            <div className="mt-2 flex flex-col gap-[14px]">
              {options.map((o) => {
                const on = value.includes(o);
                return (
                  <label key={o} className="flex cursor-pointer items-center gap-3 text-base font-normal">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
                      className="grid size-[26px] shrink-0 appearance-none place-content-center rounded-[8px] border-[3px] border-black checked:bg-black checked:after:mt-[-1px] checked:after:h-[7px] checked:after:w-3 checked:after:-rotate-45 checked:after:border-b-[3px] checked:after:border-l-[3px] checked:after:border-white checked:after:content-['']"
                    />
                    {o}
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Record<Key, string[]>>({ level: [], type: [], mode: [] });

  const list = jobs.filter((j) => {
    const text = `${j.title} ${j.company} ${j.location}`.toLowerCase();
    return (
      text.includes(q.toLowerCase()) &&
      (!f.level.length || f.level.includes(j.level)) &&
      (!f.type.length || f.type.includes(j.type)) &&
      (!f.mode.length || f.mode.includes(j.mode))
    );
  });

  return (
    <section>
      <div className="mt-[141px] max-w-[644px] md:ml-[25.2%] max-md:mt-16">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search..."
          className={`${chip} w-full px-6 py-[18px] text-lg font-normal outline-none placeholder:text-black/50`}
        />
        <div className="mt-[18px] flex flex-wrap items-center gap-4">
          {groups.map((g) => (
            <Dropdown
              key={g.key}
              label={g.label}
              options={g.options}
              value={f[g.key]}
              onChange={(v) => setF((s) => ({ ...s, [g.key]: v }))}
            />
          ))}
          <button
            onClick={() => {
              setQ("");
              setF({ level: [], type: [], mode: [] });
            }}
            className="text-base font-normal text-black/60 underline"
          >
            Reset all
          </button>
        </div>
      </div>

      <ul className="mt-[116px] space-y-[129px] max-md:space-y-16">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((j) => (
            <motion.li
              key={j.slug}
              layout
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: easeCss }}
            >
              <Link href={`/jobs/${j.slug}`} className="group flex items-center gap-[78px] max-md:gap-6">
                <FlexImage className="relative aspect-square w-[20%] shrink-0 overflow-hidden bg-surface max-md:w-24">
                  <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover:scale-105">
                    <MotionArt seed={j.logo} word={j.company.split(" ")[0]} index={jobs.indexOf(j) + 1} />
                  </div>
                </FlexImage>
                <div>
                  <h2 className="t-h2">
                    <span className="u-hover">{j.title}</span>
                  </h2>
                  <p className="t-lg mt-[20px] text-muted">{j.company}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {list.length === 0 && <p className="t-lg py-16 text-center text-muted">No roles match those filters.</p>}
    </section>
  );
}
