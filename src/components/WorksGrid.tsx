"use client";

import { Fragment, useState } from "react";
import type { Post } from "@/lib/data";
import { PostCard } from "./PostCard";

/** Every project, with a filter row ("ALL | CASE STUDY | …") built from the categories in use. */
export function WorksGrid({ posts }: { posts: Post[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [tag, setTag] = useState("All");
  const list = tag === "All" ? posts : posts.filter((p) => p.category === tag);

  return (
    <>
      {/* Grey rule 103px under the intro, filters 128px below it (same rhythm as the reference pages) */}
      <hr className="mt-[103px] border-[#808080] max-md:mt-16" />
      <section className="mt-[128px] max-md:mt-12">
        <ul className="flex flex-wrap text-[14.4px] uppercase leading-[1.2]">
          {categories.map((t, i) => (
            <Fragment key={t}>
              <li className="whitespace-nowrap">
                <button
                  onClick={() => setTag(t)}
                  aria-pressed={tag === t}
                  className={`transition-opacity duration-300 ${tag === t ? "font-bold" : "hover:opacity-60"}`}
                >
                  {t}
                </button>
                {i < categories.length - 1 && <span className="px-[0.9em]">|</span>}
              </li>
            </Fragment>
          ))}
        </ul>

        <p className="mt-6 text-sm tabular-nums text-muted">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </p>

        <div className="mt-[40px] grid gap-y-[60px] sm:grid-cols-2 sm:gap-x-[4vw] lg:grid-cols-3 lg:gap-x-[5vw]">
          {list.map((p, i) => (
            <PostCard key={`${tag}-${p.slug}`} post={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
