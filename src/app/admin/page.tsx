"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDashboard } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import {
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineCurrencyRupee,
  HiOutlineMail,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineClock,
  HiOutlineUsers,
} from "react-icons/hi";

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
  recentOrders: any[];
  ordersByStatus: Record<string, number>;
  topProducts: { _id: string; totalSold: number; totalRevenue: number }[];
  dailyRevenue: { _id: string; revenue: number; orders: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboard();
        setData(result.data);
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-80 bg-white/5 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data) return <p className="text-white/40">Failed to load dashboard</p>;

  const { stats, recentOrders, ordersByStatus, topProducts } = data;

  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      sub: `${stats.revenueGrowth > 0 ? "+" : ""}${stats.revenueGrowth}% vs last month`,
      icon: HiOutlineCurrencyRupee,
      color: "from-magenta to-magenta-dark",
      trend: stats.revenueGrowth >= 0,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      sub: `${stats.monthlyOrders} this month`,
      icon: HiOutlineShoppingCart,
      color: "from-sky to-sky-dark",
      trend: stats.orderGrowth >= 0,
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      sub: "Need attention",
      icon: HiOutlineClock,
      color: "from-yellow to-yellow-dark",
      trend: true,
    },
    {
      label: "Products",
      value: stats.totalProducts.toString(),
      sub: `${stats.totalSubscribers} subscribers`,
      icon: HiOutlineCube,
      color: "from-green-500 to-green-600",
      trend: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
              >
                <card.icon size={20} className="text-white" />
              </div>
              {card.trend ? (
                <HiOutlineTrendingUp size={16} className="text-green-400" />
              ) : (
                <HiOutlineTrendingDown size={16} className="text-red-400" />
              )}
            </div>
            <p className="text-white text-2xl font-bold">{card.value}</p>
            <p className="text-white/40 text-xs mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-[#1A1A1D] border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="text-magenta text-xs hover:underline"
            >
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <a
                        href={`/admin/orders`}
                        className="text-magenta font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-white/60">
                      {order.shipping?.fullName || "-"}
                    </td>
                    <td className="px-6 py-3 text-white font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-3 text-white/40 uppercase text-xs">
                      {order.paymentMethod}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-white/30"
                    >
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Order Status</h3>
            <div className="space-y-3">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <span className="text-white font-bold">
                    {count as number}
                  </span>
                </div>
              ))}
              {Object.keys(ordersByStatus).length === 0 && (
                <p className="text-white/30 text-sm">No orders</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Top Selling</h3>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-magenta/10 text-magenta text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {p._id}
                    </p>
                    <p className="text-white/40 text-xs">{p.totalSold} sold</p>
                  </div>
                  <span className="text-magenta text-sm font-bold">
                    {formatPrice(p.totalRevenue)}
                  </span>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-white/30 text-sm">No data yet</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/40 text-sm flex items-center gap-2">
                  <HiOutlineMail size={14} /> Unread Messages
                </span>
                <span className="text-white font-bold">
                  {stats.unreadContacts}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40 text-sm flex items-center gap-2">
                  <HiOutlineUsers size={14} /> Subscribers
                </span>
                <span className="text-white font-bold">
                  {stats.totalSubscribers}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    placed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    confirmed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    processing: "bg-yellow/10 text-yellow border-yellow/20",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    delivered: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border
                  ${styles[status] || "bg-white/5 text-white/40 border-white/10"}`}
    >
      {status}
    </span>
  );
}
