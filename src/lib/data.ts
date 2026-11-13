// Sample content. Swap these arrays for a CMS (Sanity, Contentful, Notion…) later —
// every page reads only from here.

export const site = {
  name: "Hein Htet",
  /** Shown after the highlighted name in the header logo */
  role: "UI/UX Designer",
  /** Same role, lower case, for use inside a sentence ("a UI/UX designer") */
  roleInline: "UI/UX designer",
  tagline: "Portfolio of Hein Htet, a UI/UX designer: product design, websites and brand systems.",
  email: "heincise@gmail.com",
  instagram: "https://www.instagram.com/izheinn/",
  linkedin: "https://www.linkedin.com/in/hein-htet-a67368260/",
  medium: "https://medium.com/@heincise",
  telegram: "https://t.me/heinhtet_gloria_11",
  // cv: add the CV link here when it is ready, then re-add the "Download CV" button on the About page
};

/**
 * Real profile, from hein-design-uiux.vercel.app/about. The AI assistant answers from this,
 * so keep it accurate.
 */
export const profile = {
  headline: "Designing experiences powered by AI thinking",
  summary:
    "I combine UI/UX craft with AI-driven workflows to design products that feel intuitive and ship faster.",
  /** One list for the About page and the AI chat: short, clear, no "I" so it reads well in both. */
  services: [
    { title: "UI/UX design", text: "Web and mobile interfaces, from wireframes to polished, production-ready screens." },
    { title: "UX research & strategy", text: "Understand your users, find the real problem and set the product direction, sped up with AI tools." },
    { title: "Design systems", text: "Tokens and reusable components that keep every screen consistent." },
    { title: "Prototyping", text: "Clickable prototypes that test ideas with real feedback before anything is built." },
    { title: "Usability testing", text: "Real users and honest feedback, improved until people succeed with the product." },
    { title: "Brand & motion", text: "Brand identity, illustration and motion that match the product." },
  ],
  skills: {
    "Design & UX": ["UI/UX Design", "Design Systems", "Interaction Design", "UX Research & Testing", "Wireframing & Prototyping"],
    "Brand & Visual": ["3D Illustration", "Visual Direction", "Branding", "Motion Design"],
    "AI Workflow": ["AI-Assisted Design", "Prompt Engineering for Design", "AI Prototyping Tools", "Generative UI Exploration"],
    "Strategy & Delivery": ["Product Thinking", "Design Sprint Facilitation", "Design-to-Dev Handoff", "Usability Audits"],
  } as Record<string, string[]>,
  /** Personal details, used by the AI assistant (not shown on the site yet) */
  location: "Myanmar",
  languages: ["English", "Myanmar"],
  availability: "Open to remote work with teams in many regions",
  pricing: "Not decided yet; depends on the scope, so share details through the contact page",
  tools: ["Figma", "FigJam", "Claude", "ChatGPT", "Notion"],
  /** How Hein works with AI, in his own words */
  aiMethod:
    "Brainstorms with AI assistants. Hein spots the gaps in what the AI gives and fills them with his design judgment, and the AI fills his gaps in return, so they learn from each other while solving the problem together.",
  /** Extra background for the AI assistant only (not shown on the site). Add more facts here and it will use them. */
  notes: [
    "Hein is a product designer and UI designer. UI/UX is the core of the work.",
    "Besides product design, Hein does illustration, visual design and branding, and uses AI tools across all of it to move faster and explore more ideas.",
    "Hein is actively learning AI agent workflows and bringing them into the design process. He is always evolving and likes to try new tools and ways of working.",
    "Hein is based in Myanmar, speaks English and Myanmar, and is available for remote jobs with teams in many regions. Pricing is not decided yet.",
    "Hein's daily tools include Claude, ChatGPT, Notion, FigJam and Figma, plus others, for brainstorming, research and design.",
    "Hein works with AI as a partner: he sees the gaps in what the AI produces and fills them, and the AI fills his gaps, so each learns from the other while solving the problem.",
    "Hein likes to design and also understand the front-end, so designs reach developers clearly.",
  ],
  numbers: { years: 2, projects: 24, clients: 20, industries: 8, countries: 4 },
  experience: [
    {
      role: "UI/UX Designer",
      company: "ITWIZARD (Korea)",
      period: "Full time, 2 yrs 9 mos",
      text: "Works across every stage of the product: framing the business problem, researching what users really need, prototyping, design systems, visual graphics and illustration, right through to shipping the software. Partners closely with stakeholders, clients and developers.",
      highlights: [
        "Starts from the business problem, turns it into a clear product idea and aligns it with stakeholders and clients",
        "Prototypes and validates ideas early with AI-assisted tools, then iterates with real user feedback",
        "Pinpoints user problems and solves them fast, balancing user needs with business goals",
      ],
      outcomes: ["90% faster design-to-dev handoff", "Owns both design and front-end (UX + Dev), so nothing is lost in handoff", "20+ products launched"],
    },
    {
      role: "Freelance Designer",
      company: "Independent",
      period: "Since 2024 – present",
      text: "Works with startups and brands across the globe on product design, branding and motion, shipping end-to-end from first sketch to launch.",
      highlights: ["Product design and UI for web and mobile apps", "Brand identity, visual direction and motion"],
      outcomes: ["4 freelance projects shipped end-to-end"],
    },
  ],
};

/** Seed for <MotionArt>; each seed always renders the same animated piece. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const img = (seed: string, _w = 0, _h = 0) => seed;

export type Category = "Interview Series" | "Tips" | "Case Study" | "Play" | "Thoughts";

export type QA = { q: string; a: string[]; quote?: string };

export type Post = {
  slug: string;
  title: string;
  /** Studio name or category shown under the title */
  label: string;
  category: Category;
  image: string;
  date: string;
  author: string;
  tags: string[];
  intro: string[];
  sections: QA[];
  /** Optional real image for the showreel block (a path under /public); otherwise animated art is used */
  cover?: string;
  /** UI/UX case-study details. When present the project page shows the facts and a live-prototype button. */
  ux?: UXCase;
};

export type UXCase = {
  role: string;
  timeline: string;
  platform: string;
  tools: string[];
  /** Link to the live prototype (Figma prototype, deployed demo, etc.) */
  prototype: { url: string; label?: string };
  /** Headline results shown as big numbers in the Outcome section */
  results?: Array<{ value: string; label: string }>;
};

const body: QA[] = [
  {
    q: "Where did your path into motion begin?",
    a: [
      "It wasn't a straight line. I trained in architecture, drifted into graphic design and only found motion when a client asked for a logo that 'felt alive'. That brief changed everything.",
      "I started pulling apart studio reels frame by frame, trying to understand why some identities felt inevitable when they moved and others felt bolted on.",
    ],
    quote: "Motion isn't decoration. It's the part of the brand that tells you how it behaves.",
  },
  {
    q: "How do you know a motion system is working?",
    a: [
      "When people who've never seen the guidelines can still animate something that feels on-brand. A good system has rules simple enough to remember and loose enough to surprise you.",
      "We test early with ugly prototypes. If the principle survives a bad render, it'll survive a real campaign.",
    ],
  },
  {
    q: "What's the most common mistake you see?",
    a: [
      "Treating motion as the last step. By then the logo, type and layout are locked and motion can only decorate. Bring it in during the identity phase and it can shape the whole thing.",
    ],
    quote: "If the principle survives a bad render, it'll survive a real campaign.",
  },
  {
    q: "What advice would you give someone starting out?",
    a: [
      "Make small things often. Post them. Ask studios you admire what they'd change. The feedback loop matters more than the software.",
    ],
  },
];

/* UI/UX case study template. Copy this shape for each new showcase: facts + prototype link + Q&A style sections. */
const resetUX: UXCase = {
  role: "UI/UX Designer",
  timeline: "8 weeks",
  platform: "Web and mobile app",
  tools: ["Figma", "FigJam", "Claude", "Maze", "Notion"],
  // Replace with your own prototype link
  prototype: { url: "https://www.figma.com/proto/", label: "Live prototype" },
  // Sample numbers: replace with your real results
  results: [
    { value: "94%", label: "Task completion, up from 62%" },
    { value: "-48%", label: "Average setup time" },
    { value: "3", label: "Steps instead of 9" },
  ],
};

const resetCase: QA[] = [
  {
    q: "The problem",
    a: [
      "Users were dropping off during onboarding. They reached the first setup screen, hit a wall of unfamiliar terms and left without finishing.",
      "The goal was to make the first five minutes feel guided and human, without adding steps.",
    ],
    quote: "If the first minute feels hard, nobody stays for the second.",
  },
  {
    q: "Research and insights",
    a: [
      "I ran eight user interviews and reviewed session recordings to see where people hesitated. Three patterns came up again and again: unclear wording, too many choices at once and no sense of progress.",
      "I mapped these on a journey map and ranked them by how often they blocked users, so the design work started with the biggest problem.",
    ],
  },
  {
    q: "Design process",
    a: [
      "Low-fidelity flows came first, tested on paper and in clickable wireframes. Each round removed a screen or a decision until the path felt effortless.",
      "I then built the visual layer on a small design system (type, spacing, components), so every screen stayed consistent and handoff to developers was fast.",
    ],
    quote: "Fewer decisions on each screen means more people reach the end.",
  },
  {
    q: "The solution",
    a: [
      "A three-step guided setup with plain-language labels, a visible progress bar and sensible defaults. Advanced options moved behind an optional step.",
      "Try the live prototype to click through the full flow.",
    ],
  },
  {
    q: "Outcome",
    a: [
      "In usability testing, task completion rose from 62% to 94%, and the average setup time dropped by almost half.",
    ],
  },
];

const raw: Array<[string, string, Category, string?]> = [
  ["Lena Marsh", "Interview Series", "Interview Series"],
  ["From Motion to Identity", "Tips", "Tips"],
  ["Reset: Building Empathy Through Motion", "Studio Kiln", "Case Study"],
  ["Unleashing Instinct: A Motion System for Wild Pet Food", "Ashwood Studio", "Case Study"],
  ["Giving Intelligence Form: A Motion Narrative for an AI Lab", "Bolder", "Case Study"],
  ["Simmer", "Play", "Play"],
  ["Circuit", "The Collected Works", "Case Study"],
  ["Heraldry in Motion", "Ilio", "Case Study"],
  ["Plenty", "Yambo Studio", "Case Study"],
  ["A Travel Giant's New Motion Identity", "North & Co", "Case Study"],
  ["MAD", "Hollandia Central", "Play"],
  ["Driver", "Play", "Play"],
  ["CE Europa", "Boc Studio", "Case Study"],
  ["A Neobank's Motion Identity", "Buff Motion", "Case Study"],
  ["Nava", "Wednesday Studio", "Case Study"],
  ["Who's Training the Next Generation?", "Thoughts", "Thoughts"],
  ["Unveiling an Art-First Brand", "Black Math", "Case Study"],
  ["Rerun", "Studio Gruhl", "Play"],
  ["Stephen Ong", "Interview Series", "Interview Series"],
  ["Kinetic Type Without the Gimmicks", "Tips", "Tips"],
  ["Loop", "Field Office", "Play"],
  ["Designing for the Scroll", "Thoughts", "Thoughts"],
  ["Pulse: Sound-Led Identity", "Studio Nine", "Case Study"],
  ["Mia Okafor", "Interview Series", "Interview Series"],
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const posts: Post[] = raw.map(([title, label, category], i) => ({
  slug: slugify(title),
  title,
  label,
  category,
  image: img(`mi-${slugify(title)}`),
  date: `${(28 - i) % 28 || 1} ${months[(10 - Math.floor(i / 3) + 12) % 12]} 2026`,
  author: i % 2 ? "Jamie Rowe" : "Winston Hale",
  tags: [...new Set([category, label, i % 2 ? "Branding" : "Q&A"])],
  intro: [
    `${title} explores how motion can carry a brand's personality further than any static mark. We spoke with the team behind it about process, restraint and the moments that made it click.`,
    "From early sketches to final delivery, this is a look at the decisions — big and small — that shaped the system.",
  ],
  sections: body,
  ...(slugify(title) === "reset-building-empathy-through-motion" ? { sections: resetCase, ux: resetUX } : {}),
  ...(slugify(title) === "circuit" ? { cover: "/work/circuit-showreel.webp" } : {}),
}));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/* ---------- About page ---------- */

/** Sample copy and numbers: replace everything here with your own story. */
export const about = {
  statement: "I turn complex ideas into clear, usable products.",
  intro: [
    "I design digital products, websites and brand systems, from the first sketch all the way to the final build.",
    "I work best when research, design and engineering sit at the same table, so I look for the simplest idea that solves a real problem for real people.",
    "I care about the details people feel without noticing: spacing, motion, copy and the small moments between screens.",
    "I’m open to new projects and collaborations, so if something here sparks an idea, let’s talk.",
  ],
  howTitle: "How I Work",
  how: [
    "Understand first. I start with the people and the problem: interviews, audits and a clear brief before any pixels.",
    "Design in the open. Rough ideas early, honest feedback often, and prototypes you can click rather than slides you have to imagine.",
    "Ship and learn. I stay close through build and launch, then look at what people actually do and keep improving it.",
  ],
  numbersTitle: "By the Numbers",
  numbersIntro: "A quick snapshot of the work so far.",
  stats: [
    { to: 2, decimals: 0, suffix: "+", label: "Years designing" },
    { to: 24, decimals: 0, suffix: "+", label: "Projects shipped" },
    { to: 20, decimals: 0, suffix: "+", label: "Happy clients" },
  ],
};

/* ---------- Nested menu ("Find +") ---------- */

/**
 * Demo child pages for the "Find +" menu. Replace the labels/links with real pages later;
 * each href currently opens a simple placeholder page at /more/<slug>.
 */
export const findMenu = [
  { href: "/more/child-menu-1", label: "Child menu 1" },
  { href: "/more/child-menu-2", label: "Child menu 2" },
  { href: "/more/child-menu-3", label: "Child menu 3" },
];

/* ---------- Jobs ---------- */

export type Job = {
  slug: string;
  title: string;
  company: string;
  location: string;
  level: "Junior" | "Midweight" | "Senior" | "Director";
  type: "Full Time" | "Freelance" | "Contract";
  mode: "On-site" | "Remote" | "Hybrid";
  salary: string;
  posted: string;
  logo: string;
  description: string[];
};

export const jobs: Job[] = [
  ["Head of Production", "Art & Craft", "London", "Director", "Full Time", "On-site", "£80–95k", "07/10/2026"],
  ["Creative Director", "Art & Craft", "London", "Director", "Full Time", "On-site", "£70–90k", "07/10/2026"],
  ["Motion Designer", "Northwave", "Amsterdam", "Midweight", "Full Time", "Hybrid", "€50–60k", "08/06/2026"],
  ["Senior 3D Artist", "Pixel Field", "Berlin", "Senior", "Contract", "Remote", "€450/day", "21/09/2026"],
  ["Junior Motion Designer", "Studio Kiln", "Manchester", "Junior", "Full Time", "On-site", "£28–32k", "14/09/2026"],
  ["Rive Animator", "Loopworks", "Remote", "Midweight", "Freelance", "Remote", "$70/hr", "02/10/2026"],
].map(([title, company, location, level, type, mode, salary, posted]) => ({
  slug: slugify(`${title}-${company}`),
  title,
  company,
  location,
  level: level as Job["level"],
  type: type as Job["type"],
  mode: mode as Job["mode"],
  salary,
  posted,
  logo: img(`job-${slugify(company)}`, 600, 600),
  description: [
    `${company} is looking for a ${title.toLowerCase()} to help shape motion across brand identity, campaigns and product.`,
    "You'll work closely with design and strategy from the first sketch, building motion principles that scale across every touchpoint.",
    "You have a strong reel, a love for systems thinking and the ability to explain your choices to non-designers.",
  ],
}));

export const getJob = (slug: string) => jobs.find((j) => j.slug === slug);

/* ---------- Shop ---------- */

export type Product = {
  slug: string;
  name: string;
  category: "Merch" | "Scripts";
  price: number;
  salePrice?: number;
  sizes?: string[];
  images: string[];
  description: string;
};

export const products: Product[] = [
  {
    slug: "motion-trails",
    name: "MotionTrails",
    category: "Scripts",
    price: 25,
    images: [img("shop-trails", 1000, 1250), img("shop-trails-2", 1000, 1250)],
    description: "An After Effects script that adds configurable motion trails to any layer in one click.",
  },
  {
    slug: "mo-comps",
    name: "Mo_Comps",
    category: "Scripts",
    price: 9.99,
    images: [img("shop-comps", 1000, 1250), img("shop-comps-2", 1000, 1250)],
    description: "Batch-create, rename and organise compositions. Saves hours on big deliveries.",
  },
  {
    slug: "empty-text-layer-cap",
    name: "Empty Text Layer Cap_002",
    category: "Merch",
    price: 40,
    salePrice: 35,
    images: [img("shop-cap2", 1000, 1250), img("shop-cap2-b", 1000, 1250)],
    description: "Six-panel cotton cap with embroidered front detail. One size, adjustable strap.",
  },
  {
    slug: "tee-001",
    name: "Studio T-Shirt_001",
    category: "Merch",
    price: 35,
    salePrice: 30,
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [img("shop-tee", 1000, 1250), img("shop-tee-b", 1000, 1250)],
    description: "Heavyweight organic cotton tee, boxy fit, screen-printed graphic on the back.",
  },
  {
    slug: "cap-001",
    name: "Studio Cap_001",
    category: "Merch",
    price: 35,
    salePrice: 25,
    images: [img("shop-cap1", 1000, 1250), img("shop-cap1-b", 1000, 1250)],
    description: "Washed cotton dad cap with tonal embroidery.",
  },
  {
    slug: "keyframe-kit",
    name: "Keyframe Kit",
    category: "Scripts",
    price: 19,
    images: [img("shop-kit", 1000, 1250), img("shop-kit-2", 1000, 1250)],
    description: "A set of easing presets and graph-editor shortcuts tuned for brand motion.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const money = (n: number) => `£${n.toFixed(2)}`;
