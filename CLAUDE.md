# Printala

Next.js 16 App Router storefront + admin; data from external API (`NEXT_PUBLIC_API_URL`).

Fixing issues? Follow `docs/AGENT_GUIDE.md`. Start from `docs/PROGRESS.md`; read single issues from `docs/ISSUES.md` via grep, never the whole file.

Key rules: smallest change per issue · never read `src/lib/data.ts` in full · verify with `npx tsc --noEmit` / `npm run lint` / `npm run build` (piped to tail) · don't invent business facts (prices, emails, policies) — mark blocked · one commit per issue `fix(<ID>): …`.
