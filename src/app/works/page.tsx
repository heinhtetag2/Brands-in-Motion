import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { WorksGrid } from "@/components/WorksGrid";
import { posts } from "@/lib/data";

export const metadata: Metadata = { title: "Works" };

export default function Works() {
  return (
    <>
      <PageIntro title="A selection of my projects, from first sketch to final product.">
        <p>Product design, websites and brand systems, each with the story behind it.</p>
        <p>Pick a project to read the full case study.</p>
        <p className="pt-[33px]">
          <Link href="/contact" className="pill w-[209px]">
            Start a project <span className="arrow">→</span>
          </Link>
        </p>
      </PageIntro>
      <WorksGrid posts={posts} />
    </>
  );
}
