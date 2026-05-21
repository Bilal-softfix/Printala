"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const STATUSES = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = async () => {
    try {
      const params: Record<string, string> = { limit: "50" };
      if (filterStatus) params.status = filterStatus;
      const result = await getAdminOrders(params);
      setOrders(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filterStatus]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus });
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, orderStatus: newStatus } : o,
        ),
      );
      toast.success(`Status updated to "${newStatus}" ✅`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const statusColor: Record<string, string> = {
    placed: "bg-blue-500/10 text-blue-400",
    confirmed: "bg-cyan-500/10 text-cyan-400",
    processing: "bg-yellow/10 text-yellow-600",
    shipped: "bg-purple-500/10 text-purple-400",
    delivered: "bg-green-500/10 text-green-400",
    cancelled: "bg-red-500/10 text-red-400",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Orders</h1>
          <p className="text-white/40 text-sm">{orders.length} orders</p>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              !filterStatus
                ? "bg-magenta text-white"
                : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                filterStatus === s
                  ? "bg-magenta text-white"
                  : "bg-white/5 text-white/40 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-magenta/30 border-t-magenta rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-white/30 bg-[#1A1A1D] rounded-2xl border border-white/5">
            No orders found
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-[#1A1A1D] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
            >
              {/* Order Header */}
              <div
                className="px-6 py-4 flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === order._id ? null : order._id)
                }
              >
                <div className="flex items-center gap-6 flex-wrap">
                  <div>
                    <p className="text-magenta font-bold text-sm">
                      {order.orderNumber}
                    </p>
                    <p className="text-white/30 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {order.shipping?.fullName}
                    </p>
                    <p className="text-white/30 text-xs">
                      {order.shipping?.city}, {order.shipping?.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white font-bold">
                    {formatPrice(order.total)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${statusColor[order.orderStatus] || ""}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className="text-white/20">
                    {expandedId === order._id ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order._id && (
                <div className="px-6 pb-6 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <h3 className="text-white/40 text-xs font-bold uppercase mb-3">
                        Items
                      </h3>
                      <div className="space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-white/70">
                              {item.name} ({item.size}) ×{item.quantity}
                            </span>
                            <span className="text-white font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-white/5 pt-2 mt-2 flex justify-between">
                          <span className="text-white/40 text-sm">
                            Shipping
                          </span>
                          <span className="text-white text-sm">
                            {order.shippingCost === 0
                              ? "Free"
                              : formatPrice(order.shippingCost)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span className="text-white">Total</span>
                          <span className="text-magenta">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h3 className="text-white/40 text-xs font-bold uppercase mb-3">
                        Shipping
                      </h3>
                      <div className="text-white/60 text-sm space-y-1">
                        <p className="text-white font-medium">
                          {order.shipping?.fullName}
                        </p>
                        <p>{order.shipping?.address}</p>
                        <p>
                          {order.shipping?.city}, {order.shipping?.state} —{" "}
                          {order.shipping?.pincode}
                        </p>
                        <p>📞 {order.shipping?.phone}</p>
                        <p>📧 {order.shipping?.email}</p>
                      </div>
                    </div>

                    {/* Update Status */}
                    <div>
                      <h3 className="text-white/40 text-xs font-bold uppercase mb-3">
                        Update Status
                      </h3>
                      <div className="space-y-2">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order._id, s)}
                            disabled={order.orderStatus === s}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors
                              ${
                                order.orderStatus === s
                                  ? "bg-magenta/10 text-magenta border border-magenta/20"
                                  : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                              } disabled:cursor-default`}
                          >
                            {s === order.orderStatus ? `✓ ${s}` : s}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3">
                        <p className="text-white/40 text-xs mb-1">
                          Payment:{" "}
                          <span className="text-white uppercase">
                            {order.paymentMethod}
                          </span>
                        </p>
                        <p className="text-white/40 text-xs">
                          Status:{" "}
                          <span
                            className={
                              order.paymentStatus === "paid"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
