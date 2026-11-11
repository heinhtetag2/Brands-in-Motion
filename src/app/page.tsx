import Link from "next/link";
import { Counter } from "@/components/Counter";
import { PostCard } from "@/components/PostCard";
import { Reveal, SplitText } from "@/components/Reveal";
import { about, posts, site } from "@/lib/data";

// Home: a scrollable overview of the whole portfolio. Each section links to its full page.
const featured = posts.filter((p) => p.category === "Case Study").slice(0, 6);

function SectionHead({ label, href, cta }: { label: string; href: string; cta: string }) {
  return (
    <>
      <hr className="border-[#808080]" />
      <Reveal className="flex items-baseline justify-between pb-[60px] pt-6">
        <h2 className="t-lg">{label}</h2>
        <Link href={href} className="u-hover">
          {cta} →
        </Link>
      </Reveal>
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* Intro */}
      <section className="flex min-h-[calc(100svh-var(--header-h)-80px)] flex-col justify-between gap-16 pt-[50px] max-md:pt-4">
        <div className="md:w-[72%]">
          <Reveal>
            <p className="t-lg mb-8 text-fg/65">
              Hi, I&rsquo;m {site.name}, a {site.role.toLowerCase()}.
            </p>
          </Reveal>
          <SplitText text={about.statement} className="t-h1" delay={0.15} />
        </div>
        <div className="flex flex-col gap-10 pb-10 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <Link href="/works" className="pill w-[209px]">
              See my works <span className="arrow">→</span>
            </Link>
            <Link href="/contact" className="pill w-[209px]">
              Get in touch <span className="arrow">→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="t-lg md:w-[32.7%]">
            <p>{about.intro[0]}</p>
          </Reveal>
        </div>
      </section>

      {/* Selected works */}
      <section className="mt-[60px]">
        <SectionHead label="Selected works" href="/works" cta={`All ${posts.length} projects`} />
        <div className="grid gap-y-[60px] sm:grid-cols-2 sm:gap-x-[4vw] lg:grid-cols-3 lg:gap-x-[5vw]">
          {featured.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
        <Reveal className="mt-[80px] flex justify-center">
          <Link href="/works" className="pill w-[264px]">
            View all works <span className="arrow">→</span>
          </Link>
        </Reveal>
      </section>

      {/* About */}
      <section className="mt-[150px] max-md:mt-24">
        <SectionHead label="About" href="/about" cta="More about me" />
        <div className="flex flex-col gap-10 md:flex-row md:gap-0">
          <Reveal className="md:w-[45%]">
            <h3 className="t-h2">{about.howTitle}</h3>
          </Reveal>
          <div className="t-lg space-y-[0.66em] md:ml-[13.8%] md:w-[41%]">
            {about.how.map((p) => (
              <Reveal key={p}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-[100px] grid gap-8 sm:grid-cols-3 max-md:mt-16">
          {about.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-t border-fg/25 pt-5">
              <p className="t-h1">
                <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="t-lg mt-3 text-fg/65">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mt-[150px] max-md:mt-24">
        <hr className="border-[#808080]" />
        <div className="flex flex-col gap-10 pt-[66px] md:flex-row md:items-end md:justify-between">
          <Reveal className="md:w-[58%]">
            <h2 className="t-h1">Have a project in mind? Let&rsquo;s make it real.</h2>
          </Reveal>
          <Reveal delay={0.1} className="t-lg md:w-[28.5%]">
            <p>{about.intro[3]}</p>
            <p className="pt-[33px]">
              <Link href="/contact" className="pill w-[209px]">
                Contact me <span className="arrow">→</span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
