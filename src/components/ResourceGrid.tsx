"use client";

import { useState } from "react";
import type { Post } from "@/lib/data";
import { PostCard } from "./PostCard";

const PAGE = 20;

export function ResourceGrid({ posts }: { posts: Post[] }) {
  const [shown, setShown] = useState(PAGE);

  return (
    <>
      <div className="grid gap-y-[60px] sm:grid-cols-2 sm:gap-x-[6vw] lg:grid-cols-3 lg:gap-x-[10.35vw]">
        {posts.slice(0, shown).map((p, i) => (
          <PostCard key={p.slug} post={p} index={i} priority={i < 3} />
        ))}
      </div>

      {shown < posts.length && (
        <div className="mt-[161px] flex justify-center">
          <button className="u-hover" onClick={() => setShown((n) => n + PAGE)}>
            Older Posts
          </button>
        </div>
      )}
    </>
  );
}
