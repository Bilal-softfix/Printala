"use client";

import Link from "next/link";
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineCurrencyRupee,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
} from "react-icons/hi";
import type { AdminOrder } from "@/types/admin";
import { getDashboard } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import { Card, ErrorState, PageHeader, StatusBadge, fmtDate, useAdminData } from "./ui";

interface DashboardData {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    pendingOrders: number;
    totalContacts: number;
    unreadContacts: number;
    totalSubscribers: number;
    revenueGrowth: number;
    orderGrowth: number;
  };
  recentOrders: AdminOrder[];
  ordersByStatus: Record<string, number>;
  topProducts: { _id: string; totalSold: number; totalRevenue: number }[];
  dailyRevenue?: { _id: string; revenue: number; orders: number }[];
}

export default function AdminDashboard() {
  const { state, data, reload: load } = useAdminData<DashboardData>("dashboard", () =>
    getDashboard().then((r) => r.data),
  );

  if (state === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (state === "error" || !data) {
    return (
      <Card>
        <ErrorState onRetry={load} message="Couldn't load the dashboard." />
      </Card>
    );
  }

  const { stats, recentOrders, ordersByStatus, topProducts, dailyRevenue = [] } = data;

  const cards = [
    {
      label: "Revenue this month",
      value: formatPrice(stats.monthlyRevenue ?? 0),
      sub: `${formatPrice(stats.totalRevenue)} all time`,
      growth: stats.revenueGrowth,
      icon: HiOutlineCurrencyRupee,
      tint: "bg-magenta/15 text-pink-300",
      href: "/admin/orders",
    },
    {
      label: "Orders this month",
      value: String(stats.monthlyOrders ?? 0),
      sub: `${stats.totalOrders} all time`,
      growth: stats.orderGrowth,
      icon: HiOutlineShoppingCart,
      tint: "bg-sky/15 text-sky-light",
      href: "/admin/orders",
    },
    {
      label: "Pending orders",
      value: String(stats.pendingOrders),
      sub: stats.pendingOrders ? "Need confirmation" : "All caught up",
      icon: HiOutlineClock,
      tint: "bg-amber-500/15 text-amber-300",
      href: "/admin/orders?status=placed",
    },
    {
      label: "Products",
      value: String(stats.totalProducts),
      sub: "In catalog",
      icon: HiOutlineCube,
      tint: "bg-emerald-500/15 text-emerald-300",
      href: "/admin/products",
    },
  ];

  const maxRevenue = Math.max(1, ...dailyRevenue.map((d) => d.revenue));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your store" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="group">
            <Card className="h-full p-5 transition-colors group-hover:border-white/15">
              <div className="mb-4 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
                  <c.icon size={20} aria-hidden="true" />
                </span>
                {typeof c.growth === "number" && (
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      c.growth >= 0 ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {c.growth >= 0 ? <HiOutlineArrowSmUp size={14} /> : <HiOutlineArrowSmDown size={14} />}
                    {Math.abs(c.growth)}%
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold tracking-tight">{c.value}</p>
              <p className="mt-0.5 text-sm text-white/70">{c.label}</p>
              <p className="mt-1 text-xs text-white/40">{c.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      {dailyRevenue.length > 0 && (
        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-semibold">Daily revenue</h2>
            <p className="text-xs text-white/45">Last {dailyRevenue.length} days</p>
          </div>
          <div className="flex h-44 items-end gap-1" role="img" aria-label="Daily revenue bar chart">
            {dailyRevenue.map((d) => (
              <div key={d._id} className="group relative flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-magenta/60 transition-colors group-hover:bg-magenta"
                  style={{ height: `${Math.max(2, (d.revenue / maxRevenue) * 100)}%` }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1.5 text-xs shadow-lg group-hover:block">
                  <p className="font-semibold">{formatPrice(d.revenue)}</p>
                  <p className="text-white/60">
                    {d.orders} orders · {fmtDate(d._id)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-pink-300 hover:underline">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/45">No orders yet</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {recentOrders.map((o) => (
                <li key={o._id}>
                  <Link
                    href={`/admin/orders?q=${encodeURIComponent(o.orderNumber)}`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-pink-300">{o.orderNumber}</p>
                      <p className="truncate text-xs text-white/50">
                        {o.shipping?.fullName || "—"} · {fmtDate(o.createdAt)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(o.total)}</span>
                    <StatusBadge status={o.orderStatus} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 font-semibold">Orders by status</h2>
            {Object.keys(ordersByStatus).length === 0 ? (
              <p className="text-sm text-white/45">No orders</p>
            ) : (
              <ul className="space-y-2.5">
                {Object.entries(ordersByStatus).map(([status, count]) => (
                  <li key={status}>
                    <Link
                      href={`/admin/orders?status=${status}`}
                      className="flex items-center justify-between rounded-lg px-1 py-0.5 hover:bg-white/[0.03]"
                    >
                      <StatusBadge status={status} />
                      <span className="font-semibold">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 font-semibold">Top selling</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-white/45">No sales yet</p>
            ) : (
              <ol className="space-y-3">
                {topProducts.map((p, i) => (
                  <li key={p._id} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-magenta/15 text-xs font-bold text-pink-300">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p._id}</p>
                      <p className="text-xs text-white/45">{p.totalSold} sold</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(p.totalRevenue)}</span>
                  </li>
                ))}
              </ol>
            )}
          </Card>

          <Card className="divide-y divide-white/[0.06]">
            <Link href="/admin/contacts" className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03]">
              <span className="flex items-center gap-2 text-sm text-white/70">
                <HiOutlineMail size={16} aria-hidden="true" /> Unread messages
              </span>
              <span className="font-semibold">{stats.unreadContacts}</span>
            </Link>
            <Link href="/admin/subscribers" className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03]">
              <span className="flex items-center gap-2 text-sm text-white/70">
                <HiOutlineUsers size={16} aria-hidden="true" /> Subscribers
              </span>
              <span className="font-semibold">{stats.totalSubscribers}</span>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
