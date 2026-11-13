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
      `${site.name} is a ${site.roleInline} who combines design craft with AI-driven workflows to design products that feel intuitive and ship faster. Besides product and UI design, ${first} does illustration, visual design and branding, and is always learning new ways to work with AI.\n\n` +
      `Right now ${first} is a **${job.role} at ${job.company}** (${job.period.toLowerCase()}) and also freelances for startups and brands around the world. ` +
      `So far that's **${n.projects}+ projects shipped** for **${n.clients}+ clients** across **${n.industries} industries** in **${n.countries} countries**.\n\n` +
      `More on the ${link("About page", "/about")}.`,
    next: ["What services do you offer?", "Tell me about your experience", "What's your design process?"],
  },
  {
    id: "services",
    keys: ["service", "services", "offer", "help with", "can you do", "specialize", "speciality", "specialty", "what can", "provide", "work on"],
    answer: () =>
      `${first} is a UI/UX designer, and these are the services:\n${list(profile.services.map((s) => `**${s.title}**: ${s.text}`))}\n\nBecause ${first} also works on the front-end, designs go to developers without getting lost in handoff. Have something in mind? ${link("Start a project", "/contact")}.`,
    next: ["What tools and skills do you use?", "How do you use AI in design?", "How much does a project cost?"],
  },
  {
    id: "skills",
    keys: ["skill", "skills", "tool", "tools", "figma", "software", "stack", "expertise", "good at", "strength"],
    answer: () =>
      `${first}'s skills, grouped:\n${list(Object.entries(profile.skills).map(([g, s]) => `**${g}**: ${s.join(", ")}`))}\n\n` +
      `Day to day, ${first} works in ${profile.tools.join(", ")} and other tools for brainstorming, research and design.\n\n` +
      `${first} also owns front-end development, which is why handoff to developers is smooth.`,
    next: ["How do you use AI in design?", "Tell me about your experience", "Show me the projects"],
  },
  {
    id: "ai",
    keys: ["how do you work with ai", "work with ai", "use ai", "working with ai", "ai", "artificial", "prompt", "chatgpt", "claude", "automation", "faster", "generative"],
    answer: () =>
      `AI is central to how ${first} works. ${first} treats it as a partner: ${third(profile.aiMethod.replace(/^Brainstorms/, "I brainstorm"))}\n\nIn practice:\n${list([
        `${first} uses AI tools to speed up user research, synthesis and product direction, turning weeks of discovery into days.`,
        `${first} prototypes with AI-powered design and development tools, so ideas are validated early with real user feedback.`,
        `${first} owns both design and front-end, so an idea moves from prototype to shipped product without losing anything in handoff (90% faster design-to-dev handoff at ${job.company}).`,
      ])}\n\nThe goal isn't AI for its own sake: it's reaching a validated, well-crafted product faster.`,
    next: ["What's your design process?", "What results have you delivered?", "How can we work together?"],
  },
  {
    id: "facts",
    keys: ["where", "location", "live", "country", "myanmar", "burma", "language", "languages", "speak", "english", "remote", "timezone", "based", "from"],
    answer: () =>
      `${first} is based in **${profile.location}** and speaks **${profile.languages.join(" and ")}**. ${profile.availability}.\n\nIf you have a project in mind, the quickest way is the ${link("Contact page", "/contact")}.`,
    next: ["How can we work together?", "How much does a project cost?", "Show me the projects"],
  },
  {
    id: "creative",
    keys: ["illustration", "illustrate", "illustrator", "visual", "visuals", "branding", "brand", "logo", "identity", "graphic", "creative", "art"],
    answer: () =>
      `Beyond product design, ${first} also does **illustration, visual design and branding**, and uses AI tools across all of it to explore more ideas in less time.\n\n` +
      `The same thinking runs through everything: start from the problem, explore widely, then craft the details until the result feels clear and consistent. ` +
      `See the ${link("Works page", "/works")} for examples.`,
    next: ["How do you use AI in design?", "Show me the projects", "How can we work together?"],
  },
  {
    id: "learning",
    keys: ["learning", "learn", "agent", "agents", "agentic", "evolving", "evolve", "future", "growing", "curious", "new tools"],
    answer: () =>
      `${first} is always evolving. Right now ${first} is learning **AI agent workflows** and working out how to bring them into the design process, so that research, ideas and visuals happen faster without losing craft.\n\n` +
      `It's a hands-on approach: try the new tool, test it on real work, keep what actually helps. That curiosity is part of how ${first} keeps designs and workflow fresh.`,
    next: ["How do you use AI in design?", "What's your design process?", "How can we work together?"],
  },
  {
    id: "experience",
    keys: ["experience", "job", "work history", "career", "itwizard", "korea", "company", "employ", "currently", "freelance", "freelancer", "years"],
    answer: () =>
      profile.experience
        .map((e) => `**${e.role}, ${e.company}** (${e.period})\n${e.text}\n${list(e.outcomes)}`)
        .join("\n\n") + `\n\nMore on the ${link("About page", "/about")}.`,
    next: ["What results have you delivered?", "What services do you offer?", "Show me the projects"],
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
      `${first}'s pricing isn't fixed yet and depends on the scope: a landing page, a full product and a design system are very different jobs. ` +
      `The best way to get a clear quote and timeline is to share a few details on the ${link("Contact page", "/contact")}: what you're building, your deadline and your budget range. ${first} will reply with a proposal.`,
    next: ["What services do you offer?", "What's your design process?", "How can we work together?"],
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
    next: ["How can we work together?", "Tell me about your experience", "Show me the projects"],
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
  // Text selected on the page, with the visitor's own question about it
  const selected = question.match(/^Regarding: "([\s\S]+?)"\n\n([\s\S]*)$/);
  if (selected) {
    const snippet = selected[1].trim();
    const shown = snippet.length > 140 ? `${snippet.slice(0, 140).trim()}…` : snippet;
    const intro = `You selected: “${shown}”`;

    // Is it from a project page? Say which project and section it belongs to.
    const probe = snippet.slice(0, 40).toLowerCase();
    for (const post of posts) {
      const section = post.sections.find((sec) => sec.q.toLowerCase().includes(probe) || sec.a.some((a) => a.toLowerCase().includes(probe)));
      const inIntro = post.intro.some((a) => a.toLowerCase().includes(probe));
      if (!section && !inIntro) continue;
      const where = section ? `the “${section.q}” part of` : "the introduction of";
      const gist = section ? (section.quote ? `The key idea there: “${section.quote}”` : section.a[0]) : post.intro[0];
      return withNext(
        `${intro}\n\nThis is from ${where} **${post.title}**, a ${post.category.toLowerCase()} project with ${post.label}.\n\n${gist}\n\nRead the full case study: ${link(post.title, `/resource/${post.slug}`)}.`,
        ["What's your design process?", "Show me the projects", "How can we work together?"],
      );
    }

    const topic = pick(words(`${selected[2]} ${snippet}`));
    if (topic) return withNext(`${intro}\n\nHere's the context from ${first}'s site:\n\n${topic.answer(words(snippet))}`, topic.next);
    return withNext(
      `${intro}\n\nThat's part of ${first}'s work on this site. I can't break that exact line down, but I can explain the project, the process behind it or how ${first} works. For anything specific, ${link("send a message", "/contact")} and ${first} will reply personally.`,
      ["What's your design process?", "Show me the projects", "How can we work together?"],
    );
  }

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
