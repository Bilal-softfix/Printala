import Image from "next/image";
import Link from "next/link";
import logo from "../app/assets/logo.png";

const FOOTER_LINKS = {
  Categories: [
    { label: "Anime", href: "/shop?category=anime" },
    { label: "Gaming", href: "/shop?category=gaming" },
    { label: "Cars", href: "/shop?category=cars" },
    { label: "Cricket", href: "/shop?category=cricket" },
    { label: "Movies", href: "/shop?category=movies" },
    { label: "Split Posters", href: "/shop?category=split-poster" },
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

export default function Footer() {
  return (
    <footer
      className="bg-charcoal text-white border-t-3 border-charcoal-dark"
      role="contentinfo"
    >
      <div className="container-main py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image
                src={logo}
                alt="logo"
                className="h-10 w-10 border rounded-2xl"
                width={40}
                height={40}
              />
              <span className="font-display text-2xl font-bold">
                PRINT<span className="text-magenta-light">ALA</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Premium posters for anime fans, gamers, car lovers, cricket
              fanatics & more. Your walls, your vibe.
            </p>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "Pinterest"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-xl border-2 border-white/20
                             flex items-center justify-center text-xs text-white/50
                             hover:border-magenta hover:text-magenta hover:bg-magenta/10
                             transition-all"
                  aria-label={`Follow on ${social}`}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={`${title} links`}>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-5">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-magenta-light transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4
                        border-t border-white/10 mt-12 pt-8"
        >
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Printala. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-magenta-light transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-magenta-light transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-magenta-light transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
