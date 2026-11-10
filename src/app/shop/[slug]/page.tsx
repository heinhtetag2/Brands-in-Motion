import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductView } from "@/components/ProductView";
import { getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.description } : {};
}

export default function Page({ params }: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Product params={params} />
    </Suspense>
  );
}

async function Product({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const more = products.filter((x) => x.slug !== p.slug).slice(0, 3);
  return (
    <>
      <Link href="/shop" className="link-draw text-lg">← Shop</Link>
      <ProductView p={p} />
      <section className="mt-32">
        <h2 className="mb-10 text-2xl">You may also like</h2>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((m) => (
            <ProductCard key={m.slug} p={m} />
          ))}
        </div>
      </section>
    </>
  );
}
