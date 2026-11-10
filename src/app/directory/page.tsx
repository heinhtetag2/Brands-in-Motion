import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TalentGrid } from "@/components/TalentGrid";
import { talents } from "@/lib/data";

export const metadata: Metadata = { title: "Directory" };

export default function Directory() {
  return (
    <>
      <PageIntro title="A curated selection of the best motion designers and studios in the industry.">
        <p>Want to be part of The Directory?</p>
        <p>Get your showreel in front of tens of thousands of studios, creatives and potential clients.</p>
        <p>We meticulously curate our directory to help people get partnered with the right motion designer.</p>
        <p className="pt-[33px]">
          <Link href="/partner" className="pill w-[209px]">
            Apply now <span className="arrow">→</span>
          </Link>
        </p>
      </PageIntro>
      <TalentGrid talents={talents} />
    </>
  );
}
