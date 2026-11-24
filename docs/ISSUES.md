# Printala — Issue Register

Audit date: 2026-11-24 · Stack: Next.js 16 (App Router), React 19, Tailwind 4, Zustand, Axios → external API (`printala-api.onrender.com`).

**Format:** `ID · Priority · Title` → Files / Problem / Fix / Done when.
Priority: **P0** = broken / losing money or rankings · **P1** = significant UX/SEO gap · **P2** = polish / tech debt.
`(verify)` = suspected, confirm before fixing.
Agents: find an issue with `grep -n "^### <ID>" docs/ISSUES.md` and read only that section.

---

## 1. Functionality & Business Logic

### F1 · P0 · Shipping rule uses wrong (USD-style) values
Files: `src/lib/cart.ts`
Problem: `FREE_SHIPPING_MIN = 50`, `SHIPPING_FEE = 5.99`. Product page says "Free shipping on ₹499+". Almost every order ships free; totals show `₹5.99`. `rupees()` prints `.00` decimals.
Fix: Set values from owner decision (D1), e.g. `499` / `49`. Format with `Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0})`. Use the constant in the product page TRUST text instead of hardcoding.
Done when: cart drawer, cart page, checkout and product page all show the same rule.

### F2 · P0 · No order confirmation page; order number is lost
Files: `src/app/(store)/checkout/page.tsx`, `src/lib/api.ts` (`trackOrder` unused)
Problem: After order, user is pushed to `/` with a 3s toast. No receipt, no order number to keep, no tracking page.
Fix: Add `src/app/(store)/order/[orderNumber]/page.tsx` (thank-you + summary, uses `trackOrder`). Redirect there after success. Add `/track` page with order-number form. Add both to footer "Help".
Done when: placing an order lands on a page showing the order number and items.

### F3 · P0 · Checkout validation is weak; `country` collected but never sent
Files: `src/app/(store)/checkout/page.tsx`
Problem: Phone/PIN have no pattern; `country` field is shown but dropped from payload; free-text State.
Fix: `pattern="[6-9][0-9]{9}"` + `maxLength=10` on phone, `pattern="[1-9][0-9]{5}"` on PIN, State as `<select>` of Indian states, remove Country field (India only) or send it. Show inline error text, not only toast.
Done when: invalid phone/PIN blocks submit with a visible message.

### F4 · P1 · Cart persists full product snapshot (stale price/stock)
Files: `src/store/cartStore.ts`
Problem: Whole `product` object stored in localStorage; price/stock changes never reach the cart. No max quantity.
Fix: On cart open / checkout mount, refetch products by id and update price/inStock; remove or flag sold-out items. Cap quantity (e.g. 10). Backend must recompute totals (confirm server does — D4).
Done when: changing a price in admin updates the cart total on next visit.

### F5 · P1 · API failure silently shows static fallback data
Files: `src/app/(store)/shop/page.tsx`, `src/app/(store)/product/[id]/page.tsx`, `src/components/FeaturedGrid.tsx`, `CategoryShowcase.tsx`, `SplitPosterShowcase.tsx`
Problem: On error, shop shows ALL `FALLBACK_PRODUCTS` ignoring filters/search; product page may show a fallback product whose id the API won't accept at checkout. Render free tier cold-start (>10s timeout) triggers this often.
Fix: Show an error state with "Retry" in shop/product; keep fallback only for home decorative sections. Raise timeout to 20s or move fetching server-side (see P1).
Done when: searching "xyz" while API is down shows an error, not 50 unrelated posters.

### F6 · P1 · Shop filters don't update the URL
Files: `src/app/(store)/shop/page.tsx`
Problem: Clicking category/type/sort changes state only. Not shareable, Back button loses filters, two-way sync effect is fragile. Fixed `limit: 50`, no pagination.
Fix: Make URL the single source of truth: on click `router.replace("/shop?" + params, {scroll:false})`, derive state from `useSearchParams`. Add "Load more" / page param.
Done when: filter → reload keeps the filter; Back restores previous filter.

### F7 · P1 · Footer dead links and missing policy pages
Files: `src/components/Footer.tsx`
Problem: `href="#"` for Blog, Shipping Info, Returns, Size Guide, FAQ, Privacy, Terms, Cookies and all social icons. Policy pages are required for trust and for payment gateways (Razorpay).
Fix: Create static pages `/shipping`, `/returns`, `/size-guide`, `/faq`, `/privacy`, `/terms` (one shared simple layout). Remove Blog/Cookies until real. Socials: real URLs from D3 or remove.
Done when: `grep -n 'href="#"' src` returns nothing.

### F8 · P1 · No global 404 / error / loading boundaries
Files: `src/app/` (missing `not-found.tsx`, `error.tsx`, `(store)/loading.tsx`)
Fix: Add branded `not-found.tsx` (links to shop + search), `error.tsx` with retry, light `loading.tsx`. Product page should call `notFound()` once server-rendered (S1).
Done when: `/does-not-exist` shows branded 404 with HTTP 404 status.

### F9 · P1 · Online payment missing (COD only)
Files: `src/lib/api.ts` (Razorpay call commented), checkout
Problem: COD only → higher RTO/cancellations, lost prepaid buyers.
Fix: Owner decision D2. If yes: integrate Razorpay Checkout with server-created order + `verifyPayment`. Offer prepaid incentive.

### F10 · P2 · Tag links not URL-encoded
Files: `src/app/(store)/product/[id]/page.tsx` (`/shop?search=${tag}`)
Fix: `encodeURIComponent(tag)`.

### F11 · P0 · "Invalid ID" when ordering from an old cart (fixed)
Files: `src/store/cartStore.ts`, `src/app/(store)/checkout/page.tsx`, `src/lib/server-api.ts`, `src/lib/utils.ts`
Problem: When the API cold-starts, static fallback products (ids `anime-1`…) are shown and can be added to the persisted cart; the API rejects them with HTTP 400 "Invalid ID format" at checkout.
Fix: `isOrderableId()` (24-hex ObjectId) guards add-to-cart, cart persist `version: 1` migration drops bad items, `refreshItems` treats 400/404 as removed, checkout re-validates before `createOrder`.

---

## 2. SEO

### S1 · P0 · Product page is client-only: no per-product title/description/OG
Files: `src/app/(store)/product/[id]/page.tsx`
Problem: `"use client"` + fetch in `useEffect`. Crawlers get skeleton HTML; every product shares the homepage title/description; JSON-LD injected only after JS.
Fix: Split into server `page.tsx` (fetch product with `next: {revalidate: 300}`, `generateMetadata` with title, description, OG image = product image, canonical `/product/<id>`, JSON-LD in server HTML, `notFound()` when missing) + client `ProductDetails.tsx` for size/qty/add-to-cart. Fetch related server-side too.
Done when: `curl` of a product URL contains the product name in `<title>` and the JSON-LD.

### S2 · P0 · Root canonical makes every page canonical to the homepage
Files: `src/app/layout.tsx` (`alternates: { canonical: BASE_URL }`)
Problem: Child pages without their own `alternates` (shop, product, cart, contact, checkout) inherit canonical = homepage → Google may drop them.
Fix: Remove canonical from root layout; set `alternates.canonical` per page (home `/`, shop `/shop`, product `/product/<id>`, etc.).
Done when: view-source of `/shop` shows canonical `/shop`.

### S3 · P0 · Referenced assets don't exist (404s in metadata/JSON-LD)
Files: `public/` — missing `og-image.jpg`, `apple-touch-icon.png`, `logo.svg`. `public/` still has Next boilerplate (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`).
Fix: Add 1200×630 OG image (or `src/app/opengraph-image.tsx`), 180×180 apple icon, logo (logo exists at `src/app/assets/logo.png` — export it). Delete boilerplate SVGs.
Done when: social share preview shows an image; no 404s for those paths.

### S4 · P1 · Shop, contact, cart, checkout have no own metadata
Files: those `page.tsx` files (all `"use client"`)
Fix: Add a server `layout.tsx` (or server page wrapper) per route exporting `metadata`. Shop: dynamic title for `?category=` via `generateMetadata({searchParams})`. Cart/checkout: `robots: {index:false}`.

### S5 · P1 · Sitemap uses static data, not real products
Files: `src/app/sitemap.ts`, `src/app/robots.ts`
Problem: Uses `PRODUCTS` from `data.ts` (static list), hardcoded domain, `new Date()` lastModified. Real catalog from API not listed; category pages not listed.
Fix: Fetch products from API (revalidate 3600, fallback to data.ts on failure), use `BASE_URL`, add category + policy URLs. robots: use `BASE_URL`, disallow `/admin`, `/cart`, `/checkout`.

### S6 · P1 · Category pages are query strings only
Problem: `/shop?category=anime` is weak for ranking "anime posters India".
Fix: Add `src/app/(store)/shop/[category]/page.tsx` (static params from CATEGORIES) with unique H1, 80–150 word intro copy, metadata, BreadcrumbList. Point nav/footer links there.

### S7 · P1 · Duplicate brand in homepage title
Files: `src/app/(store)/page.tsx`
Problem: Template `%s | Printala` + title starting "Printala —" → "Printala — … | Printala".
Fix: `title: { absolute: "..." }`.

### S8 · P1 · Organization/contact data inconsistent
Files: `src/lib/seo.ts`, `src/app/(store)/contact/page.tsx`, `Footer.tsx`
Problem: JSON-LD contact = personal Gmail; site shows `hello@printala.com` (and domain is `printala.in`); hours "EST" for an Indian store; `sameAs` lists social accounts that footer doesn't link.
Fix: One `SITE` config object in `src/lib/site.ts` (email, phone, hours IST, socials) used by seo.ts, contact, footer. Values from D3.

### S9 · P2 · Product JSON-LD incomplete
Files: `src/lib/seo.ts`
Fix: Add `sku`, `image` as absolute array, `offers.priceValidUntil`, `shippingDetails`, `hasMerchantReturnPolicy`; size variants as `AggregateOffer` (lowPrice/highPrice). Never add `aggregateRating` unless reviews are real.

### S10 · P2 · Product URLs use Mongo `_id`, not slug
Problem: `/product/65f…` has no keywords. `fetchProductBySlug` already exists.
Fix: Route `/product/[slug]`; keep `_id` route as 301 redirect. Do after S1. Needs API confirmation (D4).

---

## 3. UX, Usability & Content

### U1 · P1 · Mixed Hinglish/English copy
Files: grep `nahi|khali|pe jao|bhej diya|ho paya` in `src`
Problem: "Cart khali hai!", "Product nahi mila", "Shop pe jao →" inside an English, premium-toned UI.
Fix: Pick one voice (D5). Default: clear English.

### U2 · P1 · Possibly fake social proof
Files: `src/lib/data.ts` (`TESTIMONIALS`, `CATEGORIES[].count` hardcoded 86/52/44…)
Problem: Hardcoded counts don't match catalog; testimonials not tied to orders → trust and consumer-law risk.
Fix: Compute counts from API (`fetchCategories`) or hide; use real reviews only (D6).

### U3 · P1 · Product page lacks buying info
Files: product page
Fix: Add size guide link/modal (wall-scale visual), delivery estimate ("Ships in 2–3 days, delivered in 5–7"), split-poster hanging info, WhatsApp/share button. Remove the extra toast on add-to-cart (drawer opens + button state already confirm it).

### U4 · P2 · Search has no suggestions / no-results help
Files: `src/components/nav/SearchOverlay.tsx`, shop page
Fix: Show "No posters found for X" with popular categories + clear-search button; optional debounced suggestions.

### U5 · P2 · Checkout friction
Fix: Persist form in sessionStorage; show "COD available" + delivery estimate near button; order summary item link back to cart for edits.

---

## 4. Accessibility (WCAG 2.2 AA)

### A1 · P1 · Low contrast tiny labels
Problem: Many labels at 10.5–11px with `text-ink-text/55` (≈ #000 at 55% on paper) — likely below 4.5:1. (verify with a contrast checker)
Fix: Min 12px, opacity ≥ /70 for informative text.

### A2 · P1 · Size selector radiogroup lacks keyboard pattern
Files: product page size buttons
Fix: Use native `<input type="radio">` visually styled (arrow keys free) instead of `role="radio"` buttons.

### A3 · P2 · Dialog focus management (verify)
Files: `CartSidebar.tsx`, `SearchOverlay.tsx`, `nav/MobileMenu.tsx`
Fix: Confirm focus moves into dialog, is trapped, and returns to trigger on close; autofocus search input.

### A4 · P2 · Reduced motion (verify)
Files: `src/components/MotionProvider.tsx`
Fix: Ensure `<MotionConfig reducedMotion="user">`; CSS animations (Marquee) respect `prefers-reduced-motion`.

---

## 5. Performance

### P1 · P1 · Home sections fetch client-side
Files: `FeaturedGrid.tsx`, `CategoryShowcase.tsx`, `SplitPosterShowcase.tsx`
Problem: Empty/skeleton HTML first, data after JS + API cold start → poor LCP/CLS, nothing for crawlers.
Fix: Fetch in server `page.tsx` with `revalidate: 300`, pass data as props to client components.

### P2 · P1 · Static catalog bundled into client JS
Files: `src/lib/data.ts` (648 lines) imported by client components (shop, product, SearchOverlay, Footer, CategoryShowcase)
Fix: Split `CATEGORIES` (small) into `src/lib/categories.ts`; import `PRODUCTS` fallback only from server code.

### P3 · P2 · Image config too permissive
Files: `next.config.ts`
Fix: Remove `http` and `localhost`/`127.0.0.1` patterns in production (gate on `NODE_ENV`), remove unsplash if unused. Check Hero LCP image has `priority` and correct `sizes` (verify).

### P4 · P2 · Axios + two instances
Fix: Optional: server fetches via native `fetch` (needed for Next caching anyway); keep axios only for admin uploads.

---

## 6. Security & Admin

### X1 · P1 · Admin auth is client-side only, token in localStorage
Files: `src/app/admin/layout.tsx`, `src/store/adminStore.ts`, `src/lib/adminApi.ts`
Problem: Admin HTML/JS served to anyone; token readable by any XSS. (API presumably enforces auth — confirm D4.)
Fix (short): add `robots: noindex` for `/admin` (server `layout` wrapper) and `/admin` disallow in robots. Fix (long): httpOnly cookie session set by API + `middleware.ts` redirect.

### X2 · P2 · Debug logs in production
Files: grep `console.log` (product, shop, 3 home sections, `adminApi.ts` upload progress)
Fix: Remove or guard with `process.env.NODE_ENV !== "production"`.

---

## 7. Code Quality / DX

### C1 · P2 · README is create-next-app boilerplate; no `.env.example`
Fix: Short README (setup, env vars `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, scripts, deploy). Add `.env.example` (whitelist it in `.gitignore`: `!.env.example`).

### C2 · P2 · Dead/mismatched types and duplicates
Files: `src/types/index.ts` (`ShippingAddress.zipCode` vs `pincode` used), `SearchOverlay.tsx` redefines `EASE`
Fix: Align/remove type; import `EASE` from `src/lib/motion`. Add `getErrorMessage(err, fallback)` in `src/lib/utils.ts` and replace the 5 copies of the axios error cast.

### C3 · P2 · No quality gate
Fix: Add `"typecheck": "tsc --noEmit"` script; optional GitHub Action running `lint` + `typecheck` + `build`.

### C4 · P2 · Lint fails on admin pages
Files: `src/app/admin/**` (`npm run lint` → 13 errors)
Problem: `no-explicit-any`, `react-hooks/exhaustive-deps`, set-state-in-effect in `AdminShell.tsx`.
Fix: Type API responses (add admin types in `src/types`), wrap loaders in `useCallback`.
Done when: `npm run lint` exits 0.

---

## Owner decisions needed (agents: do not guess — ask)
- **D1** Free-shipping threshold and fee in ₹.
- **D2** Add Razorpay/UPI prepaid payments? Prepaid discount?
- **D3** Official contact email, phone/WhatsApp, support hours (IST), real social URLs.
- **D4** Backend: does API recompute totals, enforce admin auth, support slug lookup?
- **D5** Brand voice: English only, or intentional Hinglish?
- **D6** Are testimonials real? Keep, replace, or remove?
- **D7** Return policy terms (7 days? damaged-only?) and shipping timelines for policy pages.
