import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { localAnswer } from "@/lib/answers";
import { about, jobs, money, posts, products, site } from "@/lib/data";

// Everything the assistant knows about the site, kept compact so it fits in every request.
const knowledge = [
  `Site: ${site.tagline}`,
  "Projects (all listed on /works; link as /resource/<slug>):",
  ...posts.map((p) => `- ${p.title} | ${p.label} | ${p.category} | ${p.slug}`),
  "Jobs (link as /jobs/<slug>):",
  ...jobs.map((j) => `- ${j.title} at ${j.company} | ${j.location}, ${j.level}, ${j.type}, ${j.mode}, ${j.salary} | ${j.slug}`),
  "Shop (link as /shop/<slug>):",
  ...products.map((p) => `- ${p.name} | ${p.category} | ${money(p.salePrice ?? p.price)}${p.salePrice ? ` (was ${money(p.price)})` : ""} | ${p.slug}`),
  "Other pages: /about (about me and how I work), /works (all projects), /contact (contact form).",
].join("\n");

const system = `You are the assistant on the portfolio website of ${site.name}, a ${site.role}.
Answer questions about the whole site: who ${site.name} is, how they work, their projects, the jobs board, the shop, and how to get in touch (${site.email} or the /contact page).
Be brief and friendly: 1–4 short sentences or a short list. When you mention something on the site, link it with markdown using the relative paths below, e.g. [Works](/works).
Only state facts found below; if something isn't covered, say so and point to /contact. Never invent projects, jobs, products or personal details.

About: ${about.statement} ${about.intro.join(" ")}
How ${site.name} works: ${about.how.join(" ")}
Numbers: ${about.stats.map((x) => `${x.to}${x.suffix} ${x.label}`).join(", ")}

${knowledge}`;

const connected = () => Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);

/** Streams a prepared answer word by word, so it reads like a live reply. */
function streamLocal(text: string) {
  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      async execute({ writer }) {
        const id = "answer";
        writer.write({ type: "start" });
        writer.write({ type: "text-start", id });
        for (const chunk of text.match(/\S+\s*/g) ?? [text]) {
          writer.write({ type: "text-delta", id, delta: chunk });
          await new Promise((r) => setTimeout(r, 22));
        }
        writer.write({ type: "text-end", id });
        writer.write({ type: "finish" });
      },
    }),
  });
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // No AI model connected: answer from the site's own content (lib/answers.ts).
  // Add AI_GATEWAY_API_KEY to .env.local to switch to the full model.
  if (!connected()) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    const question = last?.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ") ?? "";
    return streamLocal(localAnswer(question));
  }

  const result = streamText({
    model: "anthropic/claude-sonnet-5.5",
    system,
    messages: await convertToModelMessages(messages.slice(-12)),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
