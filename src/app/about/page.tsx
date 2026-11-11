import type { Metadata } from "next";
import Link from "next/link";
import { Counter } from "@/components/Counter";
import { Reveal, SplitText } from "@/components/Reveal";
import { about } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

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
      <section className={`${gap} flex flex-col gap-10 md:flex-row md:gap-0 max-md:mt-12`}>
        <Reveal className="md:ml-[4.2%] md:w-[28.5%]">
          <h2 className="t-h1">{title}</h2>
        </Reveal>
        <div className="t-lg md:ml-[17.7%] md:mt-[18px] md:w-[37%]">{children}</div>
      </section>
    </>
  );
}

export default function About() {
  return (
    <div className="pt-[85px] max-md:pt-4">
      <div className="md:ml-[4.2%] md:w-[53.7%]">
        <SplitText text={about.statement} className="t-h1" />
      </div>

      <div className="t-lg mt-[57px] space-y-[0.66em] md:ml-[50.4%] md:w-[41%] max-md:mt-16">
        {about.intro.map((p) => (
          <Reveal key={p}>
            <p>{p}</p>
          </Reveal>
        ))}
      </div>

      <Row title={about.howTitle} rule="mt-[103px]" gap="mt-[66px]">
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
            Get in touch <span className="arrow">→</span>
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
          <Reveal key={s.label} delay={i * 0.08} className="flex items-baseline gap-6 border-b border-line pb-5 md:w-[82%]">
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
