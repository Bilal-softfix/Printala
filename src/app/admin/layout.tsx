"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineMail,
  HiOutlineNewspaper,
  HiOutlineLogout,
  HiOutlineCog,
} from "react-icons/hi";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useAdminStore } from "@/store/adminStore";
import toast from "react-hot-toast";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
  { href: "/admin/products", label: "Products", icon: HiOutlineCube },
  { href: "/admin/orders", label: "Orders", icon: HiOutlineShoppingCart },
  { href: "/admin/contacts", label: "Messages", icon: HiOutlineMail },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    icon: HiOutlineNewspaper,
  },
  { href: "/admin/settings", label: "Settings", icon: HiOutlineCog },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout, loadFromStorage } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadFromStorage();
    setLoaded(true);
  }, [loadFromStorage]);

  useEffect(() => {
    if (loaded && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [loaded, isAuthenticated, pathname, router]);

  // Login page — no layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading
  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-magenta/30 border-t-magenta rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] flex">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1A1A1D] border-r border-white/5
                    flex flex-col transform transition-transform duration-300 lg:translate-x-0
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #E10F80, #5FAAC6)",
              }}
            >
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Printala</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {SIDEBAR_LINKS.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                           transition-all duration-200 ${
                             isActive
                               ? "bg-magenta/10 text-magenta border border-magenta/20"
                               : "text-white/50 hover:text-white hover:bg-white/5"
                           }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-magenta/20 flex items-center justify-center">
              <span className="text-magenta text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-white/40 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400
                       hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0F0F10]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <HiOutlineBars3 size={24} />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-white font-bold text-lg capitalize">
                {pathname === "/admin"
                  ? "Dashboard"
                  : pathname.split("/admin/")[1]?.split("/")[0] || "Admin"}
              </h1>
            </div>

            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/40 hover:text-magenta transition-colors px-3 py-1.5
                         border border-white/10 rounded-lg hover:border-magenta/30"
            >
              View Store →
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
