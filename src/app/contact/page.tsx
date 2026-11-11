import type { Metadata } from "next";
import { ContactPageForm } from "@/components/ContactPageForm";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/lib/data";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageIntro title="Let’s work together on your next product.">
        <p>
          Tell me about your project: what you’re building, who it’s for and when you need it. I read every message and
          reply as soon as I can.
        </p>
        <p>
          Prefer email?{" "}
          <a href={`mailto:${site.email}`} className="u-hover">
            {site.email}
          </a>
        </p>
      </PageIntro>
      <div className="mt-[150px] max-md:mt-24">
        <ContactPageForm />
      </div>
    </>
  );
}
