# Progress

Legend: `[ ]` todo · `[x]` done · `[!]` blocked (reason). Details: `grep -n -A12 "^### <ID>" docs/ISSUES.md`.
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
- [ ] S1 Product page server-rendered + generateMetadata
- [ ] S4 Metadata for shop/contact/cart/checkout
- [ ] P1 Home sections fetched server-side
- [ ] P2 Split CATEGORIES out of data.ts
- [ ] S5 Dynamic sitemap + robots
- [ ] S6 Category landing pages
- [ ] S9 Richer Product JSON-LD

## Phase 3 — Conversion & functionality
- [!] F1 Shipping values — threshold ₹499 + INR format (no decimals) done; needs D1 fee amount (`SHIPPING_FEE` in `src/lib/cart.ts`)
- [ ] F3 Checkout validation
- [ ] F2 Order confirmation + track page
- [ ] F5 Error state instead of silent fallback
- [ ] F6 Shop filters in URL + pagination
- [ ] F4 Cart price/stock refresh
- [!] F7 Policy pages — all `#` links/socials removed from footer; Shipping/Returns/FAQ/Privacy/Terms pages need D7
- [x] S8 Single site config — `src/lib/site.ts` used by contact, footer, Org JSON-LD (phone, WhatsApp, IST hours, no email/socials)
- [x] U1 Copy consistency — all Hinglish strings → English (store + admin)
- [ ] U3 Product page buying info

## Phase 4 — Polish
- [ ] A1 Contrast / min font size
- [ ] A2 Native radio size selector
- [ ] A3 Dialog focus (verify)
- [ ] A4 Reduced motion (verify)
- [!] U2 Testimonials — keep current set, do NOT add rating schema or fake details; replace with real Flipkart/marketplace reviews (with source) when available
- [ ] U4 Search no-results UX
- [ ] U5 Checkout friction
- [ ] P3 Image config tightening
- [ ] C1 README + .env.example
- [ ] C3 typecheck script / CI
- [ ] C4 Fix pre-existing admin lint errors (13 errors: no-explicit-any, hooks deps)
- [ ] S10 Slug URLs (needs D4)
- [ ] F9 Online payments (needs D2)
- [ ] P4 fetch vs axios (optional)

## Decisions received
- D1: free shipping ≥ ₹499 (fee TBD)
- D3: phone/WhatsApp +91 8858424768; no public email; hours Mon–Sat 10–7 IST; no socials yet
- D5: English only
- D6: no real reviews yet; will import from Flipkart etc.
- D7: undecided

## Backend asks
_(API changes needed, one line each)_

## Log
_(one line per session: date · IDs done · notes)_
- 2026-11-24 · Phase 1 done (S2 S7 F10 X2 C2 F8 X1-short S3) · tsc + build pass; lint errors only pre-existing in admin (C4). S4 partly done: static metadata added; shop category titles + product metadata pending (S6/S1).
- 2026-11-24 · Decisions applied: S8 U1 done; F1 F7 U2 partial/blocked · tsc + eslint clean
