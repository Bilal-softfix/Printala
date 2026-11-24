"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineMail,
  HiOutlineNewspaper,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { HiOutlineBars3, HiXMark } from "react-icons/hi2";
import { useAdminStore } from "@/store/adminStore";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { Spinner } from "./ui";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
  { href: "/admin/orders", label: "Orders", icon: HiOutlineShoppingCart },
  { href: "/admin/products", label: "Products", icon: HiOutlineCube },
  { href: "/admin/contacts", label: "Messages", icon: HiOutlineMail },
  { href: "/admin/subscribers", label: "Subscribers", icon: HiOutlineNewspaper },
  { href: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout, loadFromStorage, hydrated } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !isLogin) router.replace("/admin/login");
  }, [hydrated, isAuthenticated, isLogin, router]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSidebarOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  if (isLogin) return <>{children}</>;

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0E0E10]">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.replace("/admin/login");
  };

  const current = SIDEBAR_LINKS.find((l) =>
    l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href),
  );

  return (
    <div className="flex min-h-screen bg-[#0E0E10] text-white">
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-[#121214] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={logo} alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-contain" />
            <span>
              <span className="block font-bold leading-tight">Printala</span>
              <span className="block text-[11px] uppercase tracking-widest text-white/45">Admin</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <HiXMark size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {SIDEBAR_LINKS.map((link) => {
            const active = current?.href === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-magenta/15 text-white ring-1 ring-inset ring-magenta/30"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <link.icon size={19} className={active ? "text-magenta" : ""} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-magenta/20 text-sm font-bold text-pink-300">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-white/45">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10"
          >
            <HiOutlineLogout size={18} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-[#0E0E10]/85 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              className="rounded-lg p-1.5 text-white/70 hover:bg-white/5 hover:text-white lg:hidden"
            >
              <HiOutlineBars3 size={22} />
            </button>
            <p className="text-sm font-medium text-white/60">{current?.label ?? "Admin"}</p>
          </div>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-magenta/40 hover:text-white"
          >
            View store <HiOutlineExternalLink size={13} aria-hidden="true" />
          </Link>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
