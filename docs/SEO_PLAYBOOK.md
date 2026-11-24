# Printala SEO Playbook

What the code already does is listed at the bottom. **Rankings now depend mostly on the steps below.** Do them in order.

## Week 1 — Get indexed (1–2 hours, one time)
1. **Google Search Console** → add property `printala.in` → "HTML tag" method → copy the code into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` on the host (Vercel env vars) → redeploy → Verify.
2. In Search Console → Sitemaps → submit `https://printala.in/sitemap.xml`.
3. URL Inspection → "Request indexing" for: `/`, `/shop`, every `/shop/<category>`.
4. **Google Merchant Center** (free) → add business → Products → Feeds → "Scheduled fetch" → `https://printala.in/feed.xml` (daily). Set shipping: free ≥ ₹499, else ₹59. This puts posters in Google Shopping + free listings — the fastest win for "anime poster" searches.
5. **Bing Webmaster Tools** → "Import from Google Search Console" (2 minutes).

## Ongoing — Content (biggest ranking factor)
Current catalog: 37 products, median description **29 characters**. Google sees these pages as thin.
- For every product, fill the admin **Search visibility** checklist:
  - Name: specific — `Gojo Satoru Jujutsu Kaisen Poster`, not `Anime Poster`.
  - Description: 150–300 words — character, series, mood, colours, where it fits (bedroom, gaming setup, hostel room).
  - 3+ tags: series, character, style.
- Fix typos in names (e.g. “Cristano”).
- Add products in thin categories first: **Football (0)**, **Gaming (1)**. A category needs ~12+ products to rank.
- Add 5–10 products per week; consistency matters more than bursts.

## Ongoing — Blog (1 post every 1–2 weeks)
Posts live in `src/lib/blog.ts` — add an object to `POSTS` (slug, title, description, date, body blocks). Sitemap, page, and Article schema are automatic.
Ideas with real search demand (India): "best anime posters for room", "poster for gym wall", "cricket posters for room", "aesthetic room decor ideas", "gift ideas for anime fans", "gaming setup wall decor", "Naruto posters", "One Piece posters", "car posters for bedroom".
Each post: answer the question fully (800+ words), link 2–3 category/product pages, end with a shop link.

## Reviews
Add real marketplace reviews and your store links in `src/lib/reviews.ts`. The homepage switches from placeholder testimonials to them automatically, labelled with their source.

## Ongoing — Links & social (authority)
- **Pinterest** business account: pin every product (Pinterest ranks on Google images for “anime poster”). Link each pin to its product page.
- **Instagram**: Reels of posters on walls; link in bio → site. Add the profile URL to `src/lib/site.ts → socials` so it appears in the footer and Google's business data.
- Get listed: Google Business Profile (if you have a pickup/work address), IndiaMART/JustDial, Reddit (r/IndianGaming, r/animeindia — be helpful, not spammy).
- Ask happy customers for reviews (later: show real reviews on the site → rich stars in Google).

## Track monthly (Search Console → Performance)
Queries, clicks, average position for: `anime posters`, `anime posters india`, `split posters`, `cricket posters`, `car posters`, `wall posters online`. Expect movement in **4–12 weeks**, not days.

## Already done in code
- Server-rendered pages: home, shop, 8 category pages, every product page.
- Unique titles/descriptions/canonicals; keyword H1 on home; breadcrumbs.
- Structured data: Product (price range, stock), Breadcrumb, Organization, WebSite search, FAQPage (home, categories, products).
- “About this poster” content + internal links on every product page; SEO copy + links on home and categories.
- Sitemap with images; robots; generated OG/Twitter images; real 404s; redirects for old URLs.
- Google Merchant feed at `/feed.xml`; Search Console verification via env var.
