import type { Metadata } from "next";
import Link from "next/link";
import { Counter } from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "Information" };

const stats = [
  { to: 86.4, decimals: 1, suffix: "k", label: "Instagram followers" },
  { to: 120.8, decimals: 1, suffix: "k", label: "Accounts reached per month" },
  { to: 861, decimals: 0, suffix: "k", label: "Views per month" },
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

export default function Information() {
  return (
    <div className="pt-[85px] max-md:pt-4">
      <Reveal className="md:ml-[4.2%] md:w-[53.7%]">
        <h1 className="t-h1">
          {site.name} is an independent resource, showcasing the very best
          motion design in branding.
        </h1>
      </Reveal>

      <div className="t-lg mt-[57px] space-y-[0.66em] md:ml-[50.4%] md:w-[41%] max-md:mt-16">
        <Reveal>
          <p>
            Founded in 2020, by{" "}
            <span className="text-muted">two designers</span>; {site.name} was
            born out of a shared passion for design and motion in branding.
          </p>
        </Reveal>
        <Reveal>
          <p>
            Leveraging our combined expertise, we launched an Instagram platform
            to spotlight exceptional work – from leading studios to emerging
            individual talents.
          </p>
        </Reveal>
        <Reveal>
          <p>
            As our community rapidly grew, it became clear that there was a
            growing demand for curated motion design inspiration, particularly
            within the branding space.
          </p>
        </Reveal>
        <Reveal>
          <p>
            In response, we set out to build a dedicated hub for
            branding-focused motion design – showcasing innovative work and
            celebrating the most exciting developments shaping the future of the
            industry.
          </p>
        </Reveal>
      </div>

      <Row title="How to Get Featured" rule="mt-[103px]" gap="mt-[66px]">
        <div className="space-y-[0.66em]">
          <Reveal>
            <p>
              We&rsquo;re suckers for anything motion, and a brand that moves is
              most certainly the icing on top of the cake. But what do we look
              for?
            </p>
          </Reveal>
          <Reveal>
            <p>
              Of course, it has to move. But how well does it speak to the brand
              ethos? Does the motion feel like it lives and breathes throughout
              the identity? Does it bring the brand to life?
            </p>
          </Reveal>
          <Reveal>
            <p>
              We also love to see behind the scenes, failures, successes,
              iterations, anything that shows the human-side of the creative
              process.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-[50px] flex flex-col items-start gap-[50px]">
          <a href={`mailto:${site.email}`} className={pill}>
            Get Featured <span className="arrow">→</span>
          </a>
          <Link href="/partner" className={pill}>
            Submission Guide <span className="arrow">→</span>
          </Link>
        </Reveal>
      </Row>

      <Row title="Our Reach" rule="mt-[144px]" gap="mt-[65px]">
        <Reveal>
          <p>
            Since we began in 2020, we&rsquo;ve seen our community grow
            massively. From motion inspiration through to Q&amp;As, Tips &amp;
            Tricks and Showreel Showcases; we aim to highlight the amazing
            motion talent our community has to offer. Here&rsquo;s some numbers
            to see how far your work could reach:
          </p>
        </Reveal>
      </Row>

      <div className="mt-[72px] space-y-[64px] md:ml-[50.4%]">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="relative flex items-start"
          >
            <p className="t-h1 w-[15.3vw] min-w-[7rem] shrink-0">
              <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="whitespace-nowrap md:absolute md:left-[15.3vw] md:top-[72px] max-md:pt-[1em]">
              {s.label}
            </p>
          </Reveal>
        ))}
        <Reveal className="!mt-[108px]">
          <a href={`mailto:${site.email}`} className={pill}>
            Get Featured <span className="arrow">→</span>
          </a>
        </Reveal>
      </div>
    </div>
  );
}
