import Link from "next/link";
import { FaInstagram, FaXTwitter, FaPinterestP } from "react-icons/fa6";
import Newsletter from "./Newsletter";
import { CATEGORIES } from "@/lib/data";

/* Existing placeholder links ("#") are kept until real pages exist. */
const COLUMNS = {
  Collections: CATEGORIES.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
  Shop: [
    { label: "All posters", href: "/shop" },
    { label: "Trending", href: "/shop?sort=bestseller" },
    { label: "Split posters", href: "/shop?category=split-poster" },
    { label: "Cart", href: "/cart" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "#" },
  ],
  Support: [
    { label: "Shipping Info", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

const SOCIAL = [
  { label: "Instagram", icon: FaInstagram },
  { label: "X (Twitter)", icon: FaXTwitter },
  { label: "Pinterest", icon: FaPinterestP },
];

export default function Footer() {
  return (
    <footer role="contentinfo" data-nav-theme="dark" className="overflow-hidden bg-ink-2 text-cream">
      <div className="container-main pt-20 md:pt-24">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
          <div>
            <Newsletter />
            <div className="mt-12 space-y-2 text-sm">
              <p className="text-[10.5px] uppercase tracking-[0.26em] text-mute">Say hello</p>
              <a href="mailto:hello@printala.com" className="block text-cream/85 transition-colors hover:text-accent">
                hello@printala.com
              </a>
              <p className="text-mute">Replies within 24 hours</p>
            </div>
            <ul className="mt-8 flex gap-2">
              {SOCIAL.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={`Printala on ${label}`}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-cream/75 transition-colors hover:border-accent hover:bg-accent hover:text-white"
                  >
                    <Icon size={15} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {Object.entries(COLUMNS).map(([title, links]) => (
              <nav key={title} aria-label={`${title} links`}>
                <h3 className="text-[10.5px] uppercase tracking-[0.26em] text-mute">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-cream/75 transition-colors hover:text-cream"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <p
        aria-hidden="true"
        className="select-none whitespace-nowrap pt-6 text-center font-display text-[17.5vw] font-bold uppercase leading-[0.8] tracking-[-0.06em] text-white/[0.06]"
      >
        Printala<span className="text-accent/60">.</span>
      </p>

      <div className="container-main flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-mute md:flex-row">
        <p>© {new Date().getFullYear()} Printala. Premium posters &amp; split wall art, made in India.</p>
        <ul className="flex gap-6">
          {["Privacy", "Terms", "Cookies"].map((p) => (
            <li key={p}>
              <a href="#" className="transition-colors hover:text-cream">
                {p}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
