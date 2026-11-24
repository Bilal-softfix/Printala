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

- [x] F11 "Invalid ID" at checkout for old carts — fallback products (ids like `anime-1`) could enter the cart; API returns 400. Fixed: `isOrderableId`, cart migration v1, refresh treats 400 as gone, checkout re-validates before ordering, fallback products not addable, server treats 400 as not found

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

## Admin panel (2026-11-24)
- [x] A-1 Product edit overwrote custom sizes with defaults on every save → sizes editor, real sizes preserved
- [x] A-2 Editing name silently changed slug → auto-slug only for new products
- [x] A-3 Flag cards used dynamic Tailwind classes (never styled) → static classes
- [x] A-4 Shared admin UI kit `src/app/admin/ui.tsx` (Card, PageHeader, StatusBadge, inputs, states, `useAdminData`)
- [x] A-5 Orders: URL filters + search (deep links from dashboard), keyboard rows, cancel confirm, tracking no., call/WhatsApp/copy address, error retry
- [x] A-6 Products: debounced search, category/stock filters, labelled icon buttons, view in store
- [x] A-7 Dashboard: revenue chart (dailyRevenue), clickable cards, per-order links, error retry
- [x] A-8 Messages list/detail + encoded mailto; Subscribers CSV export + copy emails; Settings/Login labels, autocomplete, show password, cold-start hint
- [x] A-9 Image upload: real progress (axios onUploadProgress), keyboard-accessible drop zone, English copy
- [ ] A-10 Test logged-in flows with an admin account (not done — no credentials)

## SEO push + order tracking (2026-11-24)
- [x] Home H1 = "Anime, gaming & split posters in India"; SEO intro with category links + FAQ (FAQPage)
- [x] Category FAQ (FAQPage); product "About this poster" + FAQ + category links (server-rendered)
- [x] Google Merchant feed `/feed.xml`; Search Console verification env var
- [x] Product page defaults to base size (price matches feed/JSON-LD)
- [x] Admin product form "Search visibility" checklist
- [x] Order flow: save-order card (copy / WhatsApp to self / copy link), orders remembered on device, `/track` lists recent orders, `/track?order=` links, nav "Track Order", `/track-order` etc. redirect
- [x] Blog: `/blog` + 4 posts (size guide, split posters, hang without damage, anime room decor), BlogPosting schema, sitemap, footer link, size-guide links on product pages
- [x] Blog: +6 posts (anime gifts, gaming setup, cricket, cars, gym/study motivation, matte vs glossy) → 10 total
- [x] South India SEO: 10 posts (South cinema decor, Tamil/Telugu/Kannada/Malayalam, IPL CSK/RCB/SRH, humid-city poster care, Bengaluru PG, Hyderabad, Onam/Pongal/Ugadi) + `/blog/tag/[tag]` hubs (CollectionPage schema), tag chips, related-by-tag, homepage link → 20 posts total
- [x] AI discoverability: `/llms.txt`, `/llms-full.txt` (live catalog), robots allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot…), `<link rel=alternate>` in head
- [!] Dummy marketplace ratings — declined (fake reviews; CCPA). Badges appear when real data is added to `src/lib/reviews.ts`
- [~] Reviews: `src/lib/reviews.ts` (marketplace links + real reviews replace placeholders) — waiting for store URLs/reviews (Flipkart/Amazon listings not found via web search)
- [ ] Owner: follow `docs/SEO_PLAYBOOK.md` (Search Console, Merchant Center, product content)

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
- 2026-11-24 · F11 fixed (invalid id in persisted cart) · check + build + 404 test pass · pushed.
- 2026-11-24 · Admin panel redesign + fixes (A-1…A-9) · check + build + route smoke tests pass; logged-in flows untested.
- 2026-11-24 · SEO push + order tracking UX · check + build + SSR/feed checks pass.
- 2026-11-24 · Blog + reviews plumbing · check + build + page checks pass.
- 2026-11-24 · +6 blog posts, llms.txt/llms-full.txt, AI crawler robots rules · check + build + output checks pass.
- 2026-11-24 · South India blog cluster + tag hubs · check + build + page checks pass.
