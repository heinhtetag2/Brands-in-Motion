import type { Metadata } from "next";
import { CtaRow } from "@/components/CtaRow";
import { JobBoard } from "@/components/JobBoard";
import { SplitText } from "@/components/Reveal";
import { jobs, site } from "@/lib/data";

export const metadata: Metadata = { title: "Jobs" };

export default function Jobs() {
  return (
    <>
      <div className="pt-[37px] md:w-[58%] max-md:pt-4">
        <SplitText text="Motion design specific job openings curated here." className="t-h1" />
      </div>
      <JobBoard jobs={jobs} />
      <CtaRow title="Want to post a job?" href={`mailto:${site.email}?subject=Post a job`} cta="Post a job">
        <p>We have built an amazing community of people with a motion specific interest.</p>
        <p>If you have a job role that entails any kind of motion then click the link below.</p>
      </CtaRow>
    </>
  );
}
