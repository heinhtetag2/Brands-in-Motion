import type { Metadata } from "next";
import { MotionArt } from "@/components/MotionArt";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Reveal, SplitText } from "@/components/Reveal";
import { getJob, jobs, site } from "@/lib/data";

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const job = getJob((await params).slug);
  return job ? { title: `${job.title} at ${job.company}` } : {};
}

export default function Page({ params }: PageProps<"/jobs/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <JobDetail params={params} />
    </Suspense>
  );
}

async function JobDetail({ params }: { params: PageProps<"/jobs/[slug]">["params"] }) {
  const job = getJob((await params).slug);
  if (!job) notFound();

  const meta = [
    ["Location", job.location],
    ["Level", job.level],
    ["Type", job.type],
    ["Work mode", job.mode],
    ["Salary", job.salary],
    ["Posted", job.posted],
  ];

  return (
    <article>
      <Link href="/jobs" className="link-draw text-lg">← All jobs</Link>
      <div className="mt-10 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <Reveal className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-full bg-surface">
              <MotionArt seed={job.logo} style="orbit" />
            </div>
            <p className="text-xl">{job.company}</p>
          </Reveal>
          <SplitText text={job.title} className="mt-6 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.015em]" />
          <div className="mt-14 space-y-6 text-xl leading-relaxed text-fg/80">
            {job.description.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.2} className="md:col-span-3 md:col-start-10">
          <dl className="border-t border-line">
            {meta.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-3">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`mailto:${site.email}?subject=${encodeURIComponent(job.title)}`} className="pill mt-6 w-full justify-center py-4 text-lg">
            Apply <span className="arrow">→</span>
          </a>
        </Reveal>
      </div>
    </article>
  );
}
