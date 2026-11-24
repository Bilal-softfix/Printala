"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag, HiOutlineSearch } from "react-icons/hi";
import { HiChevronDown } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import logo from "../app/assets/logo.png";
import CollectionsMenu from "./nav/CollectionsMenu";
import SearchOverlay from "./nav/SearchOverlay";
import MobileMenu from "./nav/MobileMenu";

const LINKS_LEFT = [{ href: "/shop", label: "Shop" }];
const LINKS_RIGHT = [
  { href: "/shop?sort=bestseller", label: "Trending" },
  { href: "/about", label: "About" },
];
const MOBILE_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/#collections", label: "Collections" },
  { href: "/shop?sort=bestseller", label: "Trending" },
  { href: "/shop/split-poster", label: "Split Posters" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Pathname whose data-nav-theme="dark" section is under the bar (keyed by
  // path so it resets on navigation; defaults to home so SSR paints dark).
  const [darkOn, setDarkOn] = useState<string | null>(
    pathname === "/" ? "/" : null,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);

  const dark = darkOn === pathname || mobileOpen || menuOpen;
  const solid = scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('[data-nav-theme="dark"]');
    if (!els.length) return;
    const under = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) under.add(e.target);
          else under.delete(e.target);
        }
        setDarkOn(under.size > 0 ? pathname : null);
      },
      { rootMargin: "0px 0px -92% 0px" }, // only the band the bar covers
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Hover intent for the mega-menu: open now, close after a short grace period.
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 160);
  };
  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const linkCls = `relative py-1 text-xs font-medium uppercase tracking-[0.22em] transition-colors duration-300
    after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-accent
    after:origin-right after:scale-x-0 after:transition-transform after:duration-500
    hover:after:origin-left hover:after:scale-x-100 focus-visible:after:scale-x-100 ${
      dark ? "text-cream/70 hover:text-cream" : "text-ink-text/70 hover:text-ink-text"
    }`;
  const iconCls = `relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-300 ${
    dark ? "text-cream/85 hover:text-cream hover:bg-white/[0.08]" : "text-ink-text hover:bg-black/[0.05]"
  }`;

  return (
    <>
      <header
        onPointerLeave={menuOpen ? scheduleClose : undefined}
        className={`nav-reveal fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          dark
            ? solid || mobileOpen
              ? "border-b border-white/10 bg-ink-2/85 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
            : solid
              ? "border-b border-black/10 bg-paper/85 backdrop-blur-xl"
              : "border-b border-transparent bg-paper"
        }`}
      >
        <nav
          aria-label="Main"
          className="container-main grid h-20 grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]"
        >
          {/* Wordmark */}
          <Link
            href="/"
            onClick={closeAll}
            className="flex items-center gap-2.5 justify-self-start"
            aria-label="Printala home"
          >
            <Image src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
            <span
              className={`font-display text-base font-extrabold tracking-[0.02em] transition-colors duration-500 sm:text-lg sm:tracking-[0.08em] ${
                dark ? "text-cream" : "text-ink-text"
              }`}
            >
              PRINTALA<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-10 lg:flex">
            {LINKS_LEFT.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li onPointerEnter={openMenu} onPointerLeave={scheduleClose}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="collections-menu"
                className={`${linkCls} inline-flex items-center gap-1.5 ${menuOpen ? "text-cream after:scale-x-100" : ""}`}
              >
                Collections
                <HiChevronDown
                  aria-hidden="true"
                  size={12}
                  className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </li>
            {LINKS_RIGHT.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1 justify-self-end">
            <button
              onClick={() => {
                closeAll();
                setSearchOpen(true);
              }}
              className={iconCls}
              aria-label="Search"
            >
              <HiOutlineSearch size={19} />
            </button>

            <button
              onClick={() => {
                closeAll();
                openCart();
              }}
              className={iconCls}
              aria-label={`Shopping bag, ${totalItems} items`}
            >
              {/* Re-keyed on count so the bag nudges whenever the cart changes */}
              <motion.span
                key={`bag-${totalItems}`}
                animate={{ rotate: [0, -14, 10, -4, 0] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex"
              >
                <HiOutlineShoppingBag size={19} />
              </motion.span>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className={`${iconCls} lg:hidden`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${
                    mobileOpen ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-500 ${
                    mobileOpen ? "top-1/2 -rotate-45" : "top-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <CollectionsMenu
              id="collections-menu"
              onNavigate={closeAll}
              onPointerEnter={openMenu}
              onPointerLeave={scheduleClose}
            />
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            links={MOBILE_LINKS}
            onClose={closeAll}
            onSearch={() => {
              closeAll();
              setSearchOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  );
}
