import type { Metadata } from "next";
import { CtaRow } from "@/components/CtaRow";
import { ShopGrid } from "@/components/ShopGrid";
import { products, site } from "@/lib/data";

export const metadata: Metadata = { title: "Shop" };

export default function Shop() {
  return (
    <>
      <ShopGrid products={products} />
      <CtaRow
        title="Want to sell in our shop?"
        href={`mailto:${site.email}?subject=Shop`}
        cta="Learn more"
        offset="md:ml-[54.6%]"
        rule="mt-[152px]"
        gap="mt-[39px]"
        drop="md:pt-[26px]"
      >
        <p>
          If you have a product you&rsquo;d like to share with our community, or
          an idea for a potential collaboration, please reach out below.
        </p>
      </CtaRow>
    </>
  );
}
