import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostCard } from "@/components/PostCard";
import { ProjectHero } from "@/components/ProjectHero";
import { Reveal } from "@/components/Reveal";
import { VideoBlock } from "@/components/VideoBlock";
import { getPost, posts } from "@/lib/data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/resource/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return post ? { title: post.title, description: post.intro[0] } : {};
}

export default function Page({ params }: PageProps<"/resource/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Article params={params} />
    </Suspense>
  );
}

// Column positions measured from the reference (as % of the content width)
const LEFT = "md:ml-[8.5%] md:w-[40%]";
const RIGHT = "md:ml-[51.3%] md:w-[40%]";

async function Article({
  params,
}: {
  params: PageProps<"/resource/[slug]">["params"];
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const month = post.date.split(" ").slice(1).join(" ");
  const others = posts.filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);

  return (
    <article>
      <ProjectHero
        seed={`${post.image}-hero`}
        word={post.label.split(" ")[0]}
        client={post.label}
        title={post.title}
      />

      <header className="mt-[60px] flex flex-col gap-8 md:flex-row md:justify-between">
        <Reveal className="t-lg md:w-[48.7%]">
          <p>{post.category}</p>
          <p className="text-muted">{post.tags.filter((t) => t !== post.category).join(", ")}</p>
        </Reveal>
        <Reveal delay={0.1} className="t-lg md:w-[23%]">
          <p>Published</p>
          <p>{month}</p>
        </Reveal>
      </header>

      <div className="t-lg mt-[111px] space-y-[0.66em] md:ml-[42.7%] md:w-[48.7%]">
        {post.intro.map((p, k) => (
          <Reveal key={k}>
            <p>{p}</p>
          </Reveal>
        ))}
      </div>

      <div className="mt-[150px]">
        <VideoBlock
          src={`${post.image}-reel`}
          caption={`Showreel — ${post.label}`}
          word={post.label.split(" ")[0]}
        />
      </div>

      {post.sections.map((s, k) => {
        const left = k % 2 === 0;
        return (
          <section key={k} className="mt-[150px]">
            <div className={`t-lg ${left ? LEFT : RIGHT}`}>
              <Reveal>
                <p>
                  <span className="mr-2">{String(k + 1).padStart(2, "0")}</span>
                  {s.q}
                </p>
              </Reveal>
              <hr className="mb-[44px] mt-[43px] border-[#808080]" />
              <div className="space-y-[0.66em]">
                {s.a.map((p, n) => (
                  <Reveal key={n}>
                    <p>{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            {s.quote && (
              <Reveal className={`mt-[150px] ${left ? RIGHT : LEFT}`}>
                <h2 className="t-h2">“{s.quote}”</h2>
              </Reveal>
            )}

            {k < post.sections.length - 1 && (
              <div className="mt-[150px]">
                <VideoBlock
                  src={`${post.image}-wide-${k}`}
                  word={post.label.split(" ")[0]}
                />
              </div>
            )}
          </section>
        );
      })}

      {/* Related projects: same category first, then the next ones in the list */}
      <section className="mt-[150px] max-md:mt-24">
        <hr className="border-[#808080]" />
        <Reveal className="flex items-baseline justify-between pb-[60px] pt-6">
          <h2 className="t-h2">Explore related projects</h2>
          <Link href="/works" className="u-hover">
            All projects →
          </Link>
        </Reveal>
        <div className="grid gap-y-[60px] sm:grid-cols-2 sm:gap-x-[4vw] lg:grid-cols-3 lg:gap-x-[5vw]">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} index={posts.indexOf(p)} />
          ))}
        </div>
      </section>
    </article>
  );
}
