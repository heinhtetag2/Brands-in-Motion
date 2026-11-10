import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream, type UIMessage } from "ai";
import { jobs, money, posts, products, site, talents } from "@/lib/data";

// Everything the assistant knows about the site, kept compact so it fits in every request.
const knowledge = [
  `Site: ${site.name} — ${site.tagline}`,
  "Stories (link as /resource/<slug>):",
  ...posts.map((p) => `- ${p.title} | ${p.label} | ${p.category} | ${p.slug}`),
  "Talent directory (page: /directory):",
  ...talents.map((t) => `- ${t.name} | ${t.tags.join(", ")} | ${t.website} | ${t.handle}`),
  "Jobs (link as /jobs/<slug>):",
  ...jobs.map((j) => `- ${j.title} at ${j.company} | ${j.location}, ${j.level}, ${j.type}, ${j.mode}, ${j.salary} | ${j.slug}`),
  "Shop (link as /shop/<slug>):",
  ...products.map((p) => `- ${p.name} | ${p.category} | ${money(p.salePrice ?? p.price)}${p.salePrice ? ` (was ${money(p.price)})` : ""} | ${p.slug}`),
  "Other pages: /information (about + how to get featured), /partner (agency partner form).",
].join("\n");

const system = `You are the assistant on ${site.name}, a resource for motion design in branding.
Help visitors find stories, motion designers and studios, jobs and shop items, and answer general questions about motion design and branding.
Be brief and friendly: 1–4 short sentences or a short list. When you mention something on the site, link it with markdown using the relative paths below, e.g. [Nava](/resource/nava).
Only recommend items that appear in this list; never invent people, jobs or products.

${knowledge}`;

export async function POST(req: Request) {
  // The AI Gateway authenticates with an API key locally, or OIDC automatically on Vercel.
  if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
    return Response.json(
      { error: "The assistant isn't connected yet. Add AI_GATEWAY_API_KEY to .env.local to turn it on." },
      { status: 503 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-5.5",
    system,
    messages: await convertToModelMessages(messages.slice(-12)),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
