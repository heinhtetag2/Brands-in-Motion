import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SplitText } from "@/components/Reveal";
import { findMenu } from "@/lib/data";

// Placeholder for the demo "Find +" child pages. Replace with real pages later.
export function generateStaticParams() {
  return findMenu.map((m) => ({ slug: m.href.split("/").pop()! }));
}

const find = (slug: string) => findMenu.find((m) => m.href.endsWith(`/${slug}`));

export async function generateMetadata({ params }: PageProps<"/more/[slug]">): Promise<Metadata> {
  const item = find((await params).slug);
  return item ? { title: item.label } : {};
}

export default function Page({ params }: PageProps<"/more/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <Placeholder params={params} />
    </Suspense>
  );
}

async function Placeholder({ params }: { params: PageProps<"/more/[slug]">["params"] }) {
  const item = find((await params).slug);
  if (!item) notFound();
  return (
    <section className="pt-[50px]">
      <SplitText text={item.label} className="t-h1" />
      <p className="t-lg mt-10 max-w-[28ch] text-muted">Demo page. Replace this with your own content.</p>
    </section>
  );
}
