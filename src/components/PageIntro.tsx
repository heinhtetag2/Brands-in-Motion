import { Reveal, SplitText } from "./Reveal";

/** Big statement on the left, supporting copy in the right column (as on Works/Jobs). */
export function PageIntro({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-10 pt-[49px] md:flex-row md:items-start md:gap-0 max-md:pt-4">
      <div className="md:w-[58%]">
        <SplitText text={title} className="t-h1" />
      </div>
      {children && (
        <Reveal delay={0.1} className="t-lg space-y-[0.66em] md:ml-[0.8%] md:mt-[265px] md:w-[32.7%]">
          {children}
        </Reveal>
      )}
    </section>
  );
}
