import Link from "next/link";
import type { Post } from "@/lib/data";
import { MotionArt } from "./MotionArt";
import { CardReveal, FlexImage, Reveal } from "./Reveal";

/**
 * Grid card, animated like the reference: the whole card drops in 15px (1s ease), the image
 * opens like a window from its bottom edge, and the title/subtitle rise in (0.8s).
 */
export function PostCard({ post, index = 0 }: { post: Post; index?: number; priority?: boolean }) {
  return (
    <CardReveal>
      <article>
        <Link href={`/resource/${post.slug}`} className="group block">
          <FlexImage className="relative aspect-[3/2] overflow-hidden bg-surface">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]">
              <MotionArt seed={post.image} word={post.label.split(" ")[0]} index={index} />
            </div>
          </FlexImage>
        </Link>
        <div className="w-[90%] pt-[17px]">
          <Reveal>
            <h2 className="t-h3">
              <Link href={`/resource/${post.slug}`} className="u-hover">
                {post.title}
              </Link>
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-[9px] leading-[1.15]">{post.label}</p>
          </Reveal>
        </div>
      </article>
    </CardReveal>
  );
}
