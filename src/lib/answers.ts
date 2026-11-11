import { about, jobs, money, posts, products, site } from "@/lib/data";

/**
 * Built-in answers written from the site's own content. Used by /api/chat when no AI model
 * is connected, so the assistant always replies. Topics are matched by keywords in the question.
 */

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));
const link = (label: string, href: string) => `[${label}](${href})`;
const stat = (label: string) => {
  const s = about.stats.find((x) => x.label.toLowerCase().includes(label));
  return s ? `${s.to}${s.suffix}` : "";
};

export function localAnswer(question: string): string {
  const q = question.toLowerCase();

  // A specific project named in the question
  const named = posts.find((p) => q.includes(p.title.toLowerCase()));
  if (named) {
    return `**${named.title}** is a ${named.category.toLowerCase()} project with ${named.label}. ${named.intro[0]}\n\nRead the full case study: ${link(named.title, `/resource/${named.slug}`)}.`;
  }

  if (has(q, "hello", "hi ", "hey") || q.trim() === "hi") {
    return `Hi! I can tell you about ${site.name}, the projects, how ${site.name} works, or how to get in touch. What would you like to know?`;
  }

  if (has(q, "contact", "touch", "email", "reach", "hire", "work together", "work with", "collab", "available", "freelance", "book")) {
    return `The quickest way is the ${link("Contact page", "/contact")}: share what you're building, who it's for and when you need it. You can also email **${site.email}** directly. ${about.intro[3]}`;
  }

  if (has(q, "process", "how do you work", "how does", "approach", "method", "workflow", "steps")) {
    return `${site.name} works in three steps:\n${about.how.map((h) => `- ${h}`).join("\n")}\n\nMore on the ${link("About page", "/about")}.`;
  }

  if (has(q, "project", "work", "portfolio", "case stud", "example", "show me", "built", "designed")) {
    const picks = posts.filter((p) => p.category === "Case Study").slice(0, 4);
    return `There are ${posts.length} projects on the site. A few to start with:\n${picks
      .map((p) => `- ${link(p.title, `/resource/${p.slug}`)} with ${p.label}`)
      .join("\n")}\n\nSee them all on the ${link("Works page", "/works")}.`;
  }

  if (has(q, "experience", "years", "how long", "how many", "clients", "numbers", "background")) {
    return `So far: **${stat("years")}** years designing, **${stat("projects")}** projects shipped and **${stat("clients")}** happy clients. ${about.intro[0]}`;
  }

  if (has(q, "job", "hiring", "role", "vacanc", "career", "remote", "position")) {
    const list = has(q, "remote") ? jobs.filter((j) => j.mode === "Remote") : jobs;
    const shown = (list.length ? list : jobs).slice(0, 4);
    return `Here are ${has(q, "remote") && list.length ? "the remote roles" : "some open roles"} on the jobs board:\n${shown
      .map((j) => `- ${link(`${j.title} at ${j.company}`, `/jobs/${j.slug}`)} (${j.location}, ${j.mode}, ${j.salary})`)
      .join("\n")}\n\nAll roles are on the ${link("Jobs page", "/jobs")}.`;
  }

  if (has(q, "shop", "buy", "price", "sale", "merch", "script", "product", "cost", "store")) {
    const list = has(q, "sale") ? products.filter((p) => p.salePrice) : products;
    return `In the shop${has(q, "sale") ? ", these are on sale" : ""}:\n${list
      .slice(0, 5)
      .map((p) => `- ${link(p.name, `/shop/${p.slug}`)}: ${money(p.salePrice ?? p.price)}${p.salePrice ? ` (was ${money(p.price)})` : ""}`)
      .join("\n")}\n\nBrowse everything on the ${link("Shop page", "/shop")}.`;
  }

  if (has(q, "service", "offer", "skill", "speciali", "what do", "what does", "who is", "who are", "about", "do you do", "tell me")) {
    return `${about.statement} ${about.intro[0]} ${about.intro[2]}\n\nRead more on the ${link("About page", "/about")} or see the ${link("Works", "/works")}.`;
  }

  return `I can help with questions about ${site.name}: who they are, the ${link("projects", "/works")}, how they work, the ${link("jobs board", "/jobs")}, the ${link("shop", "/shop")}, or how to ${link("get in touch", "/contact")}. Could you tell me a bit more about what you're looking for?`;
}
