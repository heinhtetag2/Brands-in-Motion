"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { talentTags, type Talent, type TalentTag } from "@/lib/data";
import { MotionArt } from "./MotionArt";
import { easeCss, FlexImage } from "./Reveal";

export function TalentGrid({ talents }: { talents: Talent[] }) {
  const [tag, setTag] = useState<"All" | TalentTag>("All");
  const list =
    tag === "All" ? talents : talents.filter((t) => t.tags.includes(tag));

  return (
    <>
      {/* Grey rule 103px under the intro, filters 128px below it (reference measurements) */}
      <hr className="mt-[103px] border-[#808080] max-md:mt-16" />
      <section className="mt-[128px] md:px-[4.3%] max-md:mt-12">
        <ul className="flex flex-wrap text-[14.4px] uppercase leading-[1.2]">
          {(["All", ...talentTags] as const).map((t, i, arr) => (
            <li key={t} className="whitespace-nowrap">
              <button
                onClick={() => setTag(t)}
                className={`transition-opacity duration-300 ${tag === t ? "font-bold" : "hover:opacity-60"}`}
              >
                {t}
              </button>
              {i < arr.length - 1 && <span className="px-[0.9em]">|</span>}
            </li>
          ))}
        </ul>

        <motion.ul
          layout
          className="mt-[56px] grid gap-x-[30px] gap-y-[80px] sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((t) => (
              <motion.li
                layout
                key={t.name}
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: easeCss }}
                className="group"
              >
                <FlexImage>
                  <a
                    href={`https://${t.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative block aspect-[378/316] overflow-hidden bg-surface"
                  >
                    <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover:scale-105">
                      <MotionArt
                        seed={t.image}
                        word={t.name.split(" ")[0]}
                        index={talents.indexOf(t) + 2}
                      />
                    </div>
                  </a>
                </FlexImage>
                <p className="t-sm mt-[12px] max-w-[80%] leading-[1.2]">
                  {t.tags.join(", ")},
                </p>
                <h3 className="t-h3 mt-[11px]">{t.name}</h3>
                <p className="mt-[13px] flex flex-col leading-[1.15]">
                  <a href={`mailto:${t.email}`} className="u-hover w-fit">
                    {t.email}
                  </a>
                  <a
                    href={`https://${t.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="u-hover w-fit"
                  >
                    {t.website}
                  </a>
                  <span>{t.handle}</span>
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </section>
    </>
  );
}
