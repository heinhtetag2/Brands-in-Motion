import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { PartnerForm } from "@/components/PartnerForm";

export const metadata: Metadata = { title: "Agency Partner" };

export default function Partner() {
  return (
    <>
      <PageIntro title="Partner with us and put your agency in front of the motion community.">
        <p>Tell us about your agency and what you&rsquo;re looking for. We reply to every enquiry within a week.</p>
      </PageIntro>
      <div className="mt-[150px]">
        <PartnerForm />
      </div>
    </>
  );
}
