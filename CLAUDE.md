# CLAUDE.md

@AGENTS.md

## What this project is

This is **Hein Htet's personal portfolio**: a UI/UX (product) designer based in Myanmar, working in English and Myanmar, open to remote work. It is hosted on Vercel (https://heinhtetdesgner.vercel.app/) from the `main` branch of https://github.com/heinhtetag2/Brands-in-Motion.git.

The site started as a clone of brandsinmotion.xyz but is now fully personalised. It is not an agency site. Everything on it speaks as one designer presenting themselves.

## Main goal

1. **Present Hein simply and clearly**: who they are, how they work, their tools, services and skills.
2. **Show UI/UX showcases** (case studies) with a consistent template: facts block (role, timeline, platform, tools), a "Live prototype ↗" button, UX sections, and small Outcome numbers.
3. **HeinHtetLLM**: an assistant that explains the showcases and Hein's work when visitors ask. Visitors can also select any text on the site and choose "Ask HeinHtetLLM" to get it explained. It should be knowledgeable, honest, natural and efficient, never salesy.

Everything we build should serve these three things.

## Visual direction (never break this)

- Minimal, editorial, clean. Design consistency matters more than adding features.
- Use existing tokens and utilities (`--bg`, `--fg`, `--muted`, `.t-lg`, `.t-h1`, `.pill`, `.fill-up`, `.u-hover`, `.gutter`). Do not invent new colours, radii, shadows or type sizes without a reason.
- Square, quiet details: the favicon is a black square with a white "H", no radius. No decorative boxes or dividers where whitespace works.
- Reuse the same patterns (spacing, grey secondary text, pill buttons, hover behaviour) so new pages feel like the old ones.

## Working rules

- Work only on `main`. Never touch the `brand-in-motions` branch.
- **Push to GitHub only when the user says so** (e.g. "push all changes to the github main"). Do not push or commit unasked.
- Content lives in one place: `src/lib/data.ts` (site, profile, about, posts, case-study data). Assistant knowledge comes from it plus `src/lib/answers.ts` and `src/app/api/chat/route.ts`. Keep these in sync when content changes.
- Next.js here differs from older versions (see AGENTS.md). Read `node_modules/next/dist/docs/` before writing new Next code. Server components can't read non-component exports from `"use client"` files.
- Secrets (`RESEND_API_KEY`, `AI_GATEWAY_API_KEY`) live only in Vercel env and git-ignored `.env.local`. Never commit them.
- Dev server: use `preview_start name=dev`. If CSS or types look stale, stop it, `rm -rf .next`, restart. Renamed filenames bust image/favicon caching.

## Current state and open items

- Real projects will be added step by step by the user. Existing posts, jobs and shop items are placeholders.
- The Reset case study (outcome numbers, copy) and the prototype link (`https://www.figma.com/proto/`) are sample values.
- Skills "Technical knowledge" (HTML, CSS, React, Next.js) and tool descriptions are guesses until the user supplies real ones.
- CV link removed until the user provides a new one. Custom domain deferred. Pricing is intentionally undecided.
- HeinHtetLLM gives fully natural answers only once `AI_GATEWAY_API_KEY` is set; until then it uses the keyword-based answers in `src/lib/answers.ts`.
