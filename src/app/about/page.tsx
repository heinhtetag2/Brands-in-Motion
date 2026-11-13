import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Counter } from "@/components/Counter";
import { FlexImage, Reveal, SplitText } from "@/components/Reveal";
import { about, profile, site } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

// Name and what each tool is used for
const tools: Array<[string, string]> = [
  ["Figma", "Interface design, design systems and clickable prototypes."],
  ["FigJam", "Flows, workshops and mapping out problems with the team."],
  ["Claude & ChatGPT", "Brainstorming, research, copy and ideas. Working with AI as a partner."],
  ["Notion", "Briefs, research notes and planning in one place."],
];

const pill = "pill w-[264px] max-w-full text-muted hover:text-bg";

function Row({
  title,
  rule,
  gap,
  children,
}: {
  title: string;
  rule: string;
  gap: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <hr className={`${rule} border-[#808080] max-md:mt-20`} />
      <section
        className={`${gap} flex flex-col gap-10 md:flex-row md:gap-0 max-md:mt-12`}
      >
        <Reveal className="md:ml-[4.2%] md:w-[28.5%]">
          <h2 className="t-h1">{title}</h2>
        </Reveal>
        <div className="t-lg md:ml-[17.7%] md:mt-[18px] md:w-[37%]">
          {children}
        </div>
      </section>
    </>
  );
}

export default function About() {
  return (
    <div className="pt-[85px] max-md:pt-4">
      <div className="md:ml-[4.2%] md:w-[53.7%]">
        <Reveal>
          <p className="t-lg mb-8 text-fg/65">
            Hi, I&rsquo;m {site.name}, a {site.roleInline}.
          </p>
        </Reveal>
        <SplitText text={about.statement} className="t-h1" delay={0.1} />
      </div>

      <div className="mt-[57px] flex flex-col gap-10 max-md:mt-16 md:flex-row md:items-start md:gap-0">
        {/* Portrait: a modest 4:5 window that wipes in like the site's other images */}
        <FlexImage className="w-[58%] max-w-[300px] md:ml-[4.2%] md:w-[24%] md:max-w-none">
          <Image
            src="/work/hein-portrait-2.jpg"
            alt={`${site.name}, ${site.roleInline}, sitting by a window`}
            width={900}
            height={1125}
            sizes="(min-width: 768px) 24vw, 58vw"
            className="block h-auto w-full"
            priority
          />
        </FlexImage>
        <div className="t-lg space-y-[0.66em] md:ml-[22.2%] md:w-[41%]">
          {about.intro.map((p) => (
            <Reveal key={p}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>

      <Row title="Services" rule="mt-[103px]" gap="mt-[66px]">
        <ul className="space-y-[1.4em]">
          {profile.services.map((sv, i) => (
            <Reveal key={sv.title} delay={i * 0.04}>
              <li className="flex gap-4">
                <span className="w-[1.6em] shrink-0 pt-[0.3em] text-[0.55em] tabular-nums text-fg/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p>{sv.title}</p>
                  <p className="mt-1 text-[0.72em] leading-[1.35] text-fg/65">
                    {sv.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Row>

      <Row title="Experience" rule="mt-[144px]" gap="mt-[65px]">
        <div className="space-y-[2.2em]">
          {profile.experience.map((e) => (
            <Reveal key={e.role + e.company}>
              <p className="text-[0.62em] uppercase tracking-[0.06em] text-fg/65">
                {e.period}
              </p>
              <p className="mt-1">
                {e.role}, {e.company}
              </p>
              <p className="mt-2 text-[0.72em] leading-[1.35] text-fg/65">
                {e.text}
              </p>
              <ul className="mt-3 space-y-1 text-[0.72em] leading-[1.35]">
                {e.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden="true">–</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <ul className="mt-4 flex flex-wrap gap-2 text-[0.6em] leading-[1.3]">
                {e.outcomes.map((o) => (
                  <li
                    key={o}
                    className="rounded-full border border-fg/30 px-3 py-2"
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Row>

      <Row title="Skills" rule="mt-[144px]" gap="mt-[65px]">
        <div className="space-y-[1.4em]">
          {Object.entries(profile.skills).map(([group, items]) => (
            <Reveal key={group}>
              <p className="text-[0.62em] uppercase tracking-[0.06em] text-fg/65">
                {group}
              </p>
              <p className="mt-1 text-[0.8em] leading-[1.35]">
                {items.join(" · ")}
              </p>
            </Reveal>
          ))}
        </div>
      </Row>

      <Row title="Tools" rule="mt-[144px]" gap="mt-[65px]">
        <ul className="space-y-[1.4em]">
          {tools.map(([name, use]) => (
            <Reveal key={name}>
              <li>
                <p>{name}</p>
                <p className="mt-1 text-[0.72em] leading-[1.35] text-fg/65">{use}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Row>

      <Row title={about.howTitle} rule="mt-[144px]" gap="mt-[65px]">
        <div className="space-y-[0.66em]">
          {about.how.map((p) => (
            <Reveal key={p}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-[50px] flex flex-col items-start gap-[50px]">
          <Link href="/works" className={pill}>
            See my works <span className="arrow">→</span>
          </Link>
          <Link href="/contact" className={pill}>
            Get in touch
            <svg
              viewBox="0 0 24 24"
              className="size-[1.05em] shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3.500 7 8.500 6.500L20.500 7" />
            </svg>
          </Link>
        </Reveal>
      </Row>

      <Row title={about.numbersTitle} rule="mt-[144px]" gap="mt-[65px]">
        <Reveal>
          <p>{about.numbersIntro}</p>
        </Reveal>
      </Row>

      <div className="mt-[72px] space-y-[28px] md:ml-[50.4%]">
        {about.stats.map((s, i) => (
          // Number and label share a baseline, with a thin rule under each pair
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="flex items-baseline gap-6 border-b border-line pb-5 md:w-[82%]"
          >
            <p className="t-h1 w-[13vw] min-w-[7rem] shrink-0">
              <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="t-lg">{s.label}</p>
          </Reveal>
        ))}
        <Reveal className="!mt-[80px]">
          <Link href="/contact" className={pill}>
            Start a project <span className="arrow">→</span>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
