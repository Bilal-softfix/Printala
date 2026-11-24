# Agent Guide — Fixing Printala Issues (token-lean)

Goal: fix items in `docs/ISSUES.md` one at a time, cheaply and safely, and record progress in `docs/PROGRESS.md`.

## Session loop (do exactly this)
1. Read `docs/PROGRESS.md` only. Pick the first `[ ]` item in the current phase whose decision (D#) is answered or not needed.
2. Read only that issue: `grep -n -A12 "^### <ID>" docs/ISSUES.md`.
3. Open only the files listed in the issue. Use line ranges (`offset/limit`, `sed -n a,bp`) for files >150 lines.
4. Make the smallest change that meets "Done when". No drive-by refactors.
5. Verify (see below). Fix failures before moving on.
6. Update the item in `docs/PROGRESS.md`: `[x]` + one-line note (files touched). Blocked → `[!]` + reason.
7. Commit per issue: `fix(<ID>): <short summary>`. Next issue, or stop if context is getting long.

## Token rules
- Never read `src/lib/data.ts` fully (648 lines). Use `grep -n` for what you need.
- Never read `package-lock.json`, `node_modules`, `.next`, images, `globals.css` in full.
- Don't re-read a file you just edited; don't re-read ISSUES.md fully.
- Prefer `grep`/`rg` to locate code over opening files to browse.
- Pipe noisy commands: `npm run build 2>&1 | tail -30`, `npx tsc --noEmit 2>&1 | head -30`.
- Don't run the dev server or take screenshots unless the issue is visual and can't be verified otherwise.
- Don't use sub-agents for single-issue work. Keep replies short: what changed, verification result.
- Batch tiny related P2 items (e.g. X2 + F10 + C2) into one session/commit when they touch few lines.

## Verification (cheapest first)
1. `npx tsc --noEmit 2>&1 | head -30`
2. `npm run lint 2>&1 | tail -20`
3. `npm run build 2>&1 | tail -30` — required for anything touching routing, metadata, server/client boundaries, sitemap/robots.
4. SEO checks after build: `npm start` then `curl -s localhost:3000/<path> | grep -o "<title>[^<]*\|canonical[^>]*"`.

## Project rules (must follow)
- App Router. Data that matters for SEO is fetched in **server components** (`fetch(url, { next: { revalidate: 300 } })`); interactivity goes in a small `"use client"` child. Don't add `"use client"` to pages.
- API base: `process.env.NEXT_PUBLIC_API_URL`; site URL: `BASE_URL` from `src/lib/seo.ts`. Never hardcode domains.
- Money: INR only, via one formatter in `src/lib/cart.ts`; shipping constants live only there.
- Styling: existing Tailwind tokens/classes (`container-main`, `btn-ink`, `field`, `field-label`, `chip`, `text-ink-text`, `bg-paper`). No new UI libraries.
- Motion: reuse `EASE` from `src/lib/motion.ts`; respect reduced motion.
- Accessibility: labels on all inputs, native elements over ARIA roles, visible focus, ≥12px informative text.
- Copy: English, concise (until D5 says otherwise). No fake numbers, reviews, or claims.
- Never invent business facts (prices, emails, policies, socials). If an issue needs a D# answer that's missing, mark `[!] needs D#` and move on.
- Don't touch the backend; note required API changes in PROGRESS under "Backend asks".
- Don't commit `.env*` (except `.env.example`). Don't push unless the user asks.

## New files: conventions
- Static content pages (policies/FAQ): `src/app/(store)/<slug>/page.tsx`, server component, export `metadata` with `alternates.canonical`.
- Shared site facts: `src/lib/site.ts` (create in S8).
- Helpers: `src/lib/utils.ts`.
