# Printala

Storefront and admin panel for Printala — premium posters and split wall art, India.
Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Zustand. Data comes from a separate API.

## Setup

```bash
npm install
cp .env.example .env.local   # adjust if needed
npm run dev                  # http://localhost:3000
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base (default `https://printala-api.onrender.com/api`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL for canonicals, sitemap, JSON-LD (default `https://printala.in`) |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check` | typecheck + lint (run before committing) |

## Structure

- `src/app/(store)/` — storefront: home, shop, `shop/[category]`, `product/[id]`, cart, checkout, `order/[orderNumber]`, track, about, contact
- `src/app/admin/` — admin panel (client-side auth via API token)
- `src/lib/server-api.ts` — server-side data fetching (ISR, 5 min); `src/lib/api.ts` / `adminApi.ts` — browser API clients
- `src/lib/site.ts` — business contact info · `src/lib/cart.ts` — shipping rules · `src/lib/seo.ts` — JSON-LD
- `src/lib/data.ts` — static fallback catalog used only when the API is unreachable

## Docs

`docs/ISSUES.md` (audit), `docs/PROGRESS.md` (status), `docs/AGENT_GUIDE.md` (how AI agents should work here).
