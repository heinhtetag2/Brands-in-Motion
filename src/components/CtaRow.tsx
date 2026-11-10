import { Reveal } from "./Reveal";

/** "Want to …?" closing block: heading on the left, copy + pill on the right. */
export function CtaRow({
  title,
  href,
  cta,
  offset = "md:ml-[58.8%]",
  rule = "mt-[151px]",
  gap = "mt-[66px]",
  drop = "",
  children,
}: {
  title: string;
  href: string;
  cta: string;
  offset?: string;
  /** Space above the grey rule */
  rule?: string;
  /** Space between the rule and the block */
  gap?: string;
  /** Extra offset of the copy column below the heading */
  drop?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <hr className={`${rule} border-[#808080] max-md:mt-20`} />
      <section className={`relative ${gap} max-md:mt-12`}>
        <Reveal className="md:absolute md:left-0 md:top-0 md:w-[33%]">
          <h2 className="t-h1">{title}</h2>
        </Reveal>
        <Reveal
          delay={0.1}
          className={`t-lg mt-8 space-y-[0.66em] md:mt-0 md:w-[28.5%] ${offset} ${drop}`}
        >
          {children}
          <p className="!mt-[50px]">
            <a href={href} className="pill w-[209px]">
              {cta} <span className="arrow">→</span>
            </a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
