import { about, jobs, money, posts, products, profile, site } from "@/lib/data";

/**
 * Built-in answers written from the site's own content (lib/data.ts). Used by /api/chat when no
 * AI model is connected. Each topic has weighted keywords; the best-scoring topic answers, and
 * short follow-ups ("tell me more", "and?") continue the previous topic.
 */

type Topic = { id: string; keys: string[]; answer: (q: string) => string; next: string[] };

const link = (label: string, href: string) => `[${label}](${href})`;
const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const first = site.name.split(" ")[0];
const n = profile.numbers;
const [job, freelance] = profile.experience;
/** Turns first-person copy ("I use…", "I craft…") into third person ("Hein uses…"). */
const third = (t: string) => t.replace(/\bI (\w+?)\b/g, (_, v: string) => `${first} ${v.endsWith("s") ? v : `${v}s`}`);

const topics: Topic[] = [
  {
    id: "greeting",
    keys: ["hello", "hi", "hey", "good morning", "good evening", "mingalaba", "yo"],
    answer: () =>
      `Hi! I'm ${site.name}'s assistant. Ask me about ${first}'s work, skills, experience, how ${first} works, or how to get in touch.`,
    next: ["What does Hein Htet do?", "Show me the projects", "How can we work together?"],
  },
  {
    id: "who",
    keys: ["who", "yourself", "introduce", "background", "bio", "hein", "htet", "what does", "what do you do", "designer"],
    answer: () =>
      `${site.name} is a ${site.role.toLowerCase()} who combines UI/UX craft with AI-driven workflows to design products that feel intuitive and ship faster.\n\n` +
      `Right now ${first} is a **${job.role} at ${job.company}** (${job.period.toLowerCase()}) and also freelances for startups and brands around the world. ` +
      `So far that's **${n.projects}+ projects shipped** for **${n.clients}+ clients** across **${n.industries} industries** in **${n.countries} countries**.\n\n` +
      `More on the ${link("About page", "/about")}.`,
    next: ["What services do you offer?", "Tell me about your experience", "What's your design process?"],
  },
  {
    id: "services",
    keys: ["service", "services", "offer", "help with", "can you do", "specialize", "speciality", "specialty", "what can", "provide", "work on"],
    answer: () =>
      `${first} can help with:\n${list(profile.services.map((s) => `**${s.title}**: ${third(s.text)}`))}\n\nHave something in mind? ${link("Start a project", "/contact")}.`,
    next: ["What tools and skills do you use?", "How do you use AI in design?", "How much does a project cost?"],
  },
  {
    id: "skills",
    keys: ["skill", "skills", "tool", "tools", "figma", "software", "stack", "expertise", "good at", "strength"],
    answer: () =>
      `${first}'s skills, grouped:\n${list(Object.entries(profile.skills).map(([g, s]) => `**${g}**: ${s.join(", ")}`))}\n\n` +
      `${first} also owns front-end development, which is why handoff to developers is smooth.`,
    next: ["How do you use AI in design?", "Tell me about your experience", "Show me the projects"],
  },
  {
    id: "ai",
    keys: ["ai", "artificial", "agentic", "prompt", "chatgpt", "claude", "automation", "faster", "generative"],
    answer: () =>
      `AI is central to how ${first} works:\n${list([
        third(profile.services[0].text),
        third(profile.services[2].text),
        `At ${job.company}, ${first} runs agentic AI workflows to research, ideate and prototype in a fraction of the time.`,
      ])}\n\nThe goal isn't AI for its own sake: it's reaching a validated, well-crafted product faster.`,
    next: ["What's your design process?", "What results have you delivered?", "How can we work together?"],
  },
  {
    id: "experience",
    keys: ["experience", "job", "work history", "career", "itwizard", "korea", "company", "employ", "currently", "freelance", "freelancer", "years"],
    answer: () =>
      profile.experience
        .map((e) => `**${e.role}, ${e.company}** (${e.period})\n${e.text}\n${list(e.outcomes)}`)
        .join("\n\n") + `\n\nFull details are in ${first}'s ${link("CV", site.cv)}.`,
    next: ["What results have you delivered?", "What services do you offer?", "Can I see your CV?"],
  },
  {
    id: "results",
    keys: ["result", "results", "outcome", "impact", "achievement", "numbers", "how many", "clients", "projects shipped", "stats"],
    answer: () =>
      `Some numbers:\n${list([
        `${n.years}+ years designing`,
        `${n.projects}+ projects shipped`,
        `${n.clients}+ happy clients`,
        `${n.industries} industries and ${n.countries} countries`,
        ...job.outcomes,
        ...freelance.outcomes,
      ])}`,
    next: ["Show me the projects", "Tell me about your experience", "How can we work together?"],
  },
  {
    id: "process",
    keys: ["process", "approach", "method", "how do you work", "workflow", "steps", "methodology", "how you work"],
    answer: () =>
      `${first}'s process, in three steps:\n${list(about.how.map(third))}\n\nAlong the way ${first} validates with real users through usability testing, and keeps design and front-end together so nothing gets lost in handoff.`,
    next: ["How do you use AI in design?", "How long does a project take?", "Show me the projects"],
  },
  {
    id: "projects",
    keys: ["project", "projects", "portfolio", "work", "works", "case study", "case studies", "example", "examples", "show me", "built", "designed"],
    answer: () => {
      const picks = posts.filter((p) => p.category === "Case Study").slice(0, 4);
      return `There are ${posts.length} projects on the site. A few to start with:\n${list(
        picks.map((p) => `${link(p.title, `/resource/${p.slug}`)} with ${p.label}`),
      )}\n\nSee them all on the ${link("Works page", "/works")}, or ask me about any project by name.`;
    },
    next: ["What's your design process?", "What results have you delivered?", "How can we work together?"],
  },
  {
    id: "contact",
    keys: ["contact", "touch", "email", "reach", "hire", "work together", "work with", "collab", "collaborate", "available", "availability", "book", "message", "talk"],
    answer: () =>
      `${first} is open to new projects and collaborations. The quickest way is the ${link("Contact page", "/contact")}: share what you're building, who it's for and when you need it, and it goes straight to ${first}'s inbox.\n\n` +
      `You can also email **${site.email}**, or reach out on ${link("LinkedIn", site.linkedin)} or ${link("Telegram", site.telegram)}.`,
    next: ["How much does a project cost?", "How long does a project take?", "What services do you offer?"],
  },
  {
    id: "price",
    keys: ["price", "pricing", "cost", "rate", "rates", "budget", "charge", "fee", "quote", "how much", "timeline", "how long", "deadline"],
    answer: () =>
      `It depends on the scope: a landing page, a full product and a design system are very different jobs. ` +
      `The best way to get a clear quote and timeline is to share a few details on the ${link("Contact page", "/contact")}: what you're building, your deadline and your budget range. ${first} will reply with a proposal.`,
    next: ["What services do you offer?", "What's your design process?", "How can we work together?"],
  },
  {
    id: "cv",
    keys: ["cv", "resume", "résumé", "download"],
    answer: () => `Here's ${first}'s ${link("CV", site.cv)} (opens Google Drive). For a quick overview, see the ${link("About page", "/about")}.`,
    next: ["Tell me about your experience", "What skills do you have?", "How can we work together?"],
  },
  {
    id: "social",
    keys: ["linkedin", "instagram", "medium", "telegram", "social", "socials", "follow", "blog", "articles", "writing"],
    answer: () =>
      `You can find ${first} on:\n${list([
        link("LinkedIn", site.linkedin),
        link("Instagram", site.instagram),
        link("Medium", site.medium) + " (writing)",
        link("Telegram", site.telegram),
      ])}`,
    next: ["How can we work together?", "Can I see your CV?", "Show me the projects"],
  },
  {
    id: "jobs",
    keys: ["jobs", "job board", "hiring", "vacancy", "vacancies", "role", "roles", "position", "opening", "remote"],
    answer: (q) => {
      const remote = q.includes("remote") ? jobs.filter((j) => j.mode === "Remote") : [];
      const shown = (remote.length ? remote : jobs).slice(0, 4);
      return `${remote.length ? "Remote roles" : "Open roles"} on the jobs board:\n${list(
        shown.map((j) => `${link(`${j.title} at ${j.company}`, `/jobs/${j.slug}`)} (${j.location}, ${j.mode}, ${j.salary})`),
      )}\n\nAll roles are on the ${link("Jobs page", "/jobs")}.`;
    },
    next: ["Any remote jobs?", "Show me the projects", "How can we work together?"],
  },
  {
    id: "shop",
    keys: ["shop", "buy", "sale", "merch", "script", "store", "product", "products", "cap", "shirt", "t-shirt"],
    answer: (q) => {
      const sale = q.includes("sale");
      const shown = sale ? products.filter((p) => p.salePrice) : products;
      return `In the shop${sale ? ", these are on sale" : ""}:\n${list(
        shown.slice(0, 5).map((p) => `${link(p.name, `/shop/${p.slug}`)}: ${money(p.salePrice ?? p.price)}${p.salePrice ? ` (was ${money(p.price)})` : ""}`),
      )}\n\nBrowse everything on the ${link("Shop page", "/shop")}.`;
    },
    next: ["What's on sale?", "Show me the projects", "How can we work together?"],
  },
  {
    id: "thanks",
    keys: ["thanks", "thank you", "thx", "great", "awesome", "cool", "nice", "bye", "goodbye"],
    answer: () => `You're welcome! If you'd like to work with ${first}, the ${link("Contact page", "/contact")} goes straight to ${first}'s inbox.`,
    next: ["Show me the projects", "How can we work together?"],
  },
];

const words = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9'é ]+/g, " ").replace(/\s+/g, " ")} `;
const followUp = /^(tell me )?(more|and|and\??|ok|okay|go on|continue|why|how|really|details?|explain)\b/;

function score(text: string, t: Topic) {
  let s = 0;
  for (const k of t.keys) if (text.includes(` ${k} `) || (k.includes(" ") && text.includes(k))) s += k.split(" ").length + 1;
  return s;
}

function pick(text: string) {
  let best: Topic | undefined;
  let bestScore = 0;
  for (const t of topics) {
    const s = score(text, t);
    if (s > bestScore) [best, bestScore] = [t, s];
  }
  return best;
}

const withNext = (body: string, next: string[]) =>
  `${body}\n\nYou could also ask:\n${next.slice(0, 3).map((x) => `- ${x}`).join("\n")}`;

/** `history` is the earlier user questions, oldest first. */
export function localAnswer(question: string, history: string[] = []): string {
  const text = words(question);

  // A project mentioned by name
  const named = posts.find((p) => text.includes(` ${p.title.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ")} `));
  if (named) {
    return withNext(
      `**${named.title}** is a ${named.category.toLowerCase()} project with ${named.label}. ${named.intro[0]}\n\nRead the full case study: ${link(named.title, `/resource/${named.slug}`)}.`,
      ["Show me more projects", "What's your design process?", "How can we work together?"],
    );
  }

  let topic = pick(text);

  // Short follow-ups ("tell me more", "and?") go one step deeper: they answer the first suggested
  // question of the previous topic. Unrecognised questions fall back to the previous topic.
  const isFollowUp = followUp.test(question.trim().toLowerCase());
  if ((!topic || isFollowUp) && history.length) {
    for (const h of [...history].reverse()) {
      const prev = pick(words(h));
      if (!prev) continue;
      topic = isFollowUp ? (pick(words(prev.next[0])) ?? prev) : (topic ?? prev);
      break;
    }
  }

  if (topic) return withNext(topic.answer(text), topic.next);

  return withNext(
    `I'm not sure about that one, but I can tell you about ${first}'s work, skills, experience, process and how to get in touch. ` +
      `For anything else, ${link("send a message", "/contact")} and ${first} will reply personally.`,
    ["What does Hein Htet do?", "Show me the projects", "How can we work together?"],
  );
}
