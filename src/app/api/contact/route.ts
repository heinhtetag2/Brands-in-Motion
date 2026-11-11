import { site } from "@/lib/data";

// Sends contact-form messages to site.email through Resend (installed from the Vercel Marketplace).
// Without a verified domain, Resend only delivers from onboarding@resend.dev to the Resend account's own email.
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Portfolio contact <onboarding@resend.dev>";

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "Email isn't set up yet." }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Hidden field real visitors never fill in; bots usually do.
  if (clean(body.nickname, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const website = clean(body.website, 300);
  const message = clean(body.message, 5000);
  const needs = Array.isArray(body.needs) ? body.needs.map((n) => clean(n, 60)).filter(Boolean).slice(0, 10) : [];

  if (!name || !message || !isEmail(email)) {
    return Response.json({ error: "Add your name, a valid email and a message." }, { status: 400 });
  }

  const details = [
    `Name: ${name}`,
    `Email: ${email}`,
    company && `Company: ${company}`,
    website && `Website: ${website}`,
    needs.length > 0 && `Looking for: ${needs.join(", ")}`,
  ].filter(Boolean);
  const text = `${message}\n\n${details.join("\n")}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [site.email],
      reply_to: email,
      subject: `Project enquiry from ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return Response.json({ error: "Your message couldn't be sent. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
