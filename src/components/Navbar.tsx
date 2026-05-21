"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShoppingBag, HiOutlineSearch } from "react-icons/hi";
import { HiOutlineBars2, HiXMark } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import logo from "../app/assets/logo.png";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=split-poster", label: "Split Posters" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = useCartStore((s) => s.totalItems());
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_4px_0_#2F3542] border-b-3 border-charcoal"
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <nav className="container-main flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 group flex items-center gap-2"
            aria-label="Printala Home"
          >
            {/* Ribbon "P" icon placeholder */}
            {/* <div
              className="w-10 h-10 rounded-xl flex items-center justify-center
                            border-3 border-charcoal shadow-[3px_3px_0_#2F3542]
                            group-hover:shadow-[4px_4px_0_#E10F80] group-hover:border-magenta
                            transition-all"
              style={{
                background: "linear-gradient(135deg, #E10F80, #5FAAC6)",
              }}
            >
              <span className="font-comic text-white text-xl font-bold">P</span>
            </div> */}

            <Image
              src={logo}
              alt="logo"
              className="h-10 w-10 border rounded-2xl"
              width={40}
              height={40}
            />
            <span className="font-display text-xl font-bold tracking-tight text-charcoal">
              PRINT<span className="text-gradient">ALA</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-bold uppercase tracking-wider text-charcoal-light
                           hover:text-magenta transition-colors duration-300
                           after:absolute after:bottom-[-4px] after:left-0 after:h-[3px]
                           after:w-0 after:bg-magenta after:rounded-full after:transition-all after:duration-300
                           hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-xl border-2 border-charcoal flex items-center justify-center
                         text-charcoal hover:bg-sky hover:text-white hover:border-sky
                         transition-all shadow-[2px_2px_0_#2F3542] hover:shadow-[3px_3px_0_#2F3542]"
              aria-label="Toggle search"
            >
              <HiOutlineSearch size={18} />
            </button>

            <button
              onClick={openCart}
              className="relative w-10 h-10 rounded-xl border-2 border-charcoal flex items-center justify-center
                         text-charcoal hover:bg-magenta hover:text-white hover:border-magenta
                         transition-all shadow-[2px_2px_0_#2F3542] hover:shadow-[3px_3px_0_#2F3542]"
              aria-label={`Cart with ${totalItems} items`}
            >
              <HiOutlineShoppingBag size={18} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow text-charcoal
                             text-[10px] font-black rounded-full flex items-center justify-center
                             border-2 border-charcoal"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-charcoal"
              aria-label={`Cart ${totalItems} items`}
            >
              <HiOutlineShoppingBag size={22} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 bg-yellow text-charcoal
                                 text-[10px] font-black rounded-full flex items-center justify-center
                                 border-2 border-charcoal"
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-charcoal"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <HiXMark size={26} />
              ) : (
                <HiOutlineBars2 size={26} />
              )}
            </button>
          </div>
        </nav>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t-3 border-charcoal bg-white"
            >
              <form onSubmit={handleSearch} className="container-main py-4">
                <div className="relative max-w-2xl mx-auto">
                  <HiOutlineSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anime, cars, gaming, cricket..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 border-3 border-charcoal rounded-xl
                               font-medium focus:outline-none focus:border-magenta
                               focus:shadow-[4px_4px_0_#E10F80] transition-all"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg-primary flex flex-col items-center justify-center halftone"
          >
            <nav className="flex flex-col items-center gap-6">
              {[{ href: "/", label: "Home" }, ...NAV_LINKS].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="comic-text-solid text-4xl md:text-5xl font-display font-bold
                               hover:text-magenta transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 w-72"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="input-field text-center"
                />
              </motion.form>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
