import { Reveal } from "./Reveal";

/** Big statement on the left, supporting copy in the right column (as on Directory/Jobs). */
export function PageIntro({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-10 pt-[49px] md:flex-row md:items-start md:gap-0 max-md:pt-4">
      <Reveal className="md:w-[58%]">
        <h1 className="t-h1">{title}</h1>
      </Reveal>
      {children && (
        <Reveal delay={0.1} className="t-lg space-y-[0.66em] md:ml-[0.8%] md:mt-[265px] md:w-[32.7%]">
          {children}
        </Reveal>
      )}
    </section>
  );
}
