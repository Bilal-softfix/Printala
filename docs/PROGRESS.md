# Progress

Legend: `[ ]` todo · `[~]` partial · `[x]` done · `[!]` blocked (reason). Details: `grep -n -A12 "^### <ID>" docs/ISSUES.md`.
Work phases in order. Within a phase, top to bottom.

## Phase 1 — Quick wins (no decisions needed)
- [x] S2 Remove root canonical; per-page canonicals — root canonical removed; route layouts for shop/contact/cart/checkout add canonicals (product canonical comes with S1)
- [x] S7 Homepage title `absolute` — `(store)/page.tsx`
- [x] F10 Encode tag links — product page
- [x] X2 Remove console.log — 5 fallback logs + upload progress log removed
- [x] C2 Types/EASE cleanup + getErrorMessage helper — `getErrorMessage` in utils (checkout/contact/newsletter); EASE import; removed ShippingAddress
- [x] F8 not-found / error / loading pages — `app/not-found.tsx`, `(store)/error.tsx`, `(store)/loading.tsx`
- [x] X1 (short) noindex + robots disallow /admin — admin `layout.tsx` (server, noindex) wraps `AdminShell.tsx`; robots disallow /admin,/cart,/checkout, uses BASE_URL
- [x] S3 OG image, apple icon, logo; delete boilerplate SVGs — generated `opengraph-image.tsx`/`twitter-image.tsx`, `apple-icon.png`, `public/logo.png`; boilerplate SVGs deleted

## Phase 2 — SEO & rendering core
- [x] S1 Product page server-rendered + generateMetadata — `product/[id]/page.tsx` (server, ISR 5m, real 404) + `ProductDetails.tsx` (client); `src/lib/server-api.ts`; titles trimmed to ~60 chars; add-to-cart toast removed
- [x] S4 Metadata — static metadata + category titles via S6
- [x] P1 Home sections fetched server-side — home page ISR 5m; FeaturedGrid/CategoryShowcase/SplitPosterShowcase take props
- [x] P2 Split CATEGORIES — `src/lib/categories.ts` (data.ts re-exports); client components import it
- [x] S5 Dynamic sitemap — from API (fallback data.ts), BASE_URL, product images
- [x] S6 Category landing pages — `/shop/[category]` (8 static pages, ISR 5m, unique H1/intro/meta, breadcrumb JSON-LD, noindex when empty); all nav links updated; `/shop?category=x` → 308; added to sitemap
- [x] S9 Product JSON-LD — sku, image array, AggregateOffer (low/high by size)

## Phase 3 — Conversion & functionality
- [x] F1 Shipping values — free ≥ ₹499, else ₹59; INR format
- [x] F3 Checkout validation — phone/PIN patterns + hints, state dropdown, country removed, `:user-invalid` style
- [x] F2 Order confirmation + track — `/order/[orderNumber]` (API + sessionStorage snapshot, noindex), `/track`, footer link
- [x] F5 Error state — shop shows retry state, no static fallback (product page still falls back server-side if API is down)
- [~] F6 Shop filters in URL — type/sort/search in URL via router.replace; category chips link to `/shop/[category]`; pagination still TODO (limit 50)
- [x] F4 Cart refresh — `refreshItems()` + `useCartRefresh` on cart/checkout; removes gone/sold-out items with toast; qty cap 10
- [!] F7 Policy pages — all `#` links/socials removed from footer; Shipping/Returns/FAQ/Privacy/Terms pages need D7
- [x] S8 Single site config — `src/lib/site.ts` used by contact, footer, Org JSON-LD (phone, WhatsApp, IST hours, no email/socials)
- [x] U1 Copy consistency — all Hinglish strings → English (store + admin)
- [~] U3 Product page — WhatsApp question link, toast removed; size guide + delivery estimate need D7

## Phase 4 — Polish
- [x] A1 Contrast — store text /45,/55 → /70 (≈6:1), 10–11px → 12px
- [x] A2 Native radio size selector (sr-only input, focus ring on label)
- [x] A3 Dialog focus — `src/hooks/useDialogFocus.ts` (move in, trap, Esc, restore) on cart, search, mobile menu
- [x] A4 Reduced motion — already OK (MotionConfig user + CSS media queries)
- [!] U2 Testimonials — keep current set, do NOT add rating schema or fake details; replace with real Flipkart/marketplace reviews (with source) when available
- [x] U4 Search no-results — shop empty state names the query + Clear filters (done with F6)
- [ ] U5 Checkout friction — skipped for now (form persistence low value; COD note already shown)
- [x] P3 Image config — http/localhost hosts dev-only; live catalog verified all https; hero already priority
- [x] C1 README + .env.example
- [x] C3 `npm run typecheck`, `npm run check` (CI workflow not added)
- [x] C4 Admin lint — `src/types/admin.ts`, getErrorMessage, useCallback loaders, store `hydrated` flag; `npm run check` passes clean
- [ ] S10 Slug URLs (needs D4)
- [ ] F9 Online payments (needs D2)
- [ ] P4 fetch vs axios (optional)

## Decisions received
- D1: free shipping ≥ ₹499, else ₹59
- D3: phone/WhatsApp +91 8858424768; no public email; hours Mon–Sat 10–7 IST; no socials yet
- D5: English only
- D6: no real reviews yet; will import from Flipkart etc.
- D7: undecided

## Backend asks
_(API changes needed, one line each)_
- Confirm API computes shippingCost the same way (free ≥ ₹499, else ₹59) — frontend total must match the order total.
- Confirm `GET /orders/track/:orderNumber` returns orderStatus, items[{name,size,quantity,price}], shippingCost, total.

## Log
_(one line per session: date · IDs done · notes)_
- 2026-11-24 · Phase 1 done (S2 S7 F10 X2 C2 F8 X1-short S3) · tsc + build pass; lint errors only pre-existing in admin (C4). S4 partly done: static metadata added; shop category titles + product metadata pending (S6/S1).
- 2026-11-24 · Decisions applied: S8 U1 done; F1 F7 U2 partial/blocked · tsc + eslint clean
- 2026-11-24 · Phase 2: S1 P1 P2 S5 S9 done · removed `(store)/loading.tsx` (it forced HTTP 200 on notFound) · build + SSR checks pass. Next: S6 (+ rest of S4).
- 2026-11-24 · S6 + S4 done; default title says "Free Shipping over ₹499" · build + SSR checks pass. Phase 2 complete. Football category has 0 products (noindexed).
- 2026-11-24 · Phase 3: F1 F2 F3 F4 F5 done; F6 U3 partial · build + route smoke tests pass. Remaining: F7 (D7), F6 pagination, U3 rest (D7).
- 2026-11-24 · Phase 4: A1 A2 A3 A4 U4 P3 C1 C3 C4 done · `npm run check` + build + smoke tests pass. Remaining: U2 (real reviews), S10 (D4), F9 (D2), U5, P4, F7 (D7), F6 pagination.
