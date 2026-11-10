// Sample content. Swap these arrays for a CMS (Sanity, Contentful, Notion…) later —
// every page reads only from here.

export const site = {
  name: "Index of Motion",
  tagline: "An independent resource celebrating the best motion design in branding.",
  instagram: "https://instagram.com",
  email: "hello@example.com",
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
}));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/* ---------- Talent directory ---------- */

export const talentTags = [
  "Individual", "Studio", "2D", "3D", "After Effects", "AI", "Blender", "Cell", "Cavalry",
  "Cinema 4D", "Houdini", "Live Action", "Mixed Media", "Nuke", "Octane", "Redshift", "Rive",
] as const;
export type TalentTag = (typeof talentTags)[number];

export type Talent = {
  name: string;
  tags: TalentTag[];
  email: string;
  website: string;
  handle: string;
  image: string;
};

const talentRaw: Array<[string, TalentTag[]]> = [
  ["Sean Harper", ["Individual", "2D", "After Effects"]],
  ["Wrong Room", ["Studio", "3D", "Cinema 4D", "Cavalry", "Redshift"]],
  ["Oren Shai", ["Individual", "3D", "Cinema 4D", "Redshift"]],
  ["Stu Creative", ["Studio", "3D", "Mixed Media", "Rive"]],
  ["Reece Palmer", ["Studio", "2D", "Cell", "After Effects"]],
  ["Fieldwork", ["Studio", "2D", "After Effects"]],
  ["Theresa Hahn", ["Individual", "3D", "Cell", "Mixed Media"]],
  ["Tal Uri", ["Individual", "Studio", "3D", "Mixed Media"]],
  ["Nea Studio", ["Studio", "3D", "Blender", "Cinema 4D"]],
  ["Ivan Iarov", ["Individual", "3D", "Houdini", "Redshift"]],
  ["Marwan Kay", ["Individual", "3D", "Cinema 4D", "After Effects"]],
  ["Nadia Diaz", ["Individual", "3D", "Cinema 4D", "Octane"]],
  ["The Rusty Pixel", ["Studio", "Cinema 4D", "Redshift"]],
  ["Alex Prado", ["Individual", "3D", "Octane", "Redshift"]],
  ["Edgar Fern", ["Individual", "3D", "Octane", "AI"]],
  ["Jack Keon", ["Individual", "2D", "Cavalry", "Rive"]],
  ["Seventeen", ["Studio", "3D", "Live Action", "Houdini", "Nuke"]],
  ["Paloma Ruiz", ["Individual", "2D", "Cell", "AI"]],
];

export const talents: Talent[] = talentRaw.map(([name, tags]) => {
  const s = slugify(name);
  return {
    name,
    tags,
    email: `hello@${s.replace(/-/g, "")}.com`,
    website: `${s.replace(/-/g, "")}.com`,
    handle: `@${s.replace(/-/g, "_")}`,
    image: img(`talent-${s}`, 900, 900),
  };
});

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
