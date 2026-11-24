"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineSearch, HiOutlinePhone, HiChevronDown } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa6";
import toast from "react-hot-toast";
import type { AdminOrder } from "@/types/admin";
import { getAdminOrders, updateOrderStatus } from "@/lib/adminApi";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  ORDER_STATUSES,
  PageHeader,
  StatusBadge,
  btnGhost,
  btnPrimary,
  fmtDate,
  inputCls,
  useAdminData,
} from "../ui";

function OrdersContent() {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const q = params.get("q") ?? "";

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState(q);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/admin/orders${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  const { state, data, reload: load, mutate } = useAdminData<AdminOrder[]>(`orders:${status}`, () =>
    getAdminOrders({ limit: "100", ...(status ? { status } : {}) }).then((r) => r.data || []),
  );
  const orders = useMemo(() => data ?? [], [data]);

  // Debounced search → URL (so links like ?q=ORD123 deep-link to an order).
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== q) setParam("q", search.trim());
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const visible = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return orders;
    return orders.filter((o) =>
      [o.orderNumber, o.shipping?.fullName, o.shipping?.phone, o.shipping?.city, o.shipping?.pincode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term)),
    );
  }, [orders, q]);

  // Auto-open when the search pinpoints a single order.
  const openId = expandedId ?? (visible.length === 1 && q ? visible[0]._id : null);

  const changeStatus = async (order: AdminOrder, next: string, trackingNumber?: string) => {
    if (next === "cancelled" && !confirm(`Cancel order ${order.orderNumber}?`)) return;
    try {
      await updateOrderStatus(order._id, {
        orderStatus: next,
        ...(trackingNumber ? { trackingNumber } : {}),
      });
      mutate((list) =>
        list.map((o) =>
          o._id === order._id
            ? { ...o, orderStatus: next, ...(trackingNumber ? { trackingNumber } : {}) }
            : o,
        ),
      );
      toast.success(`${order.orderNumber} → ${next}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed"));
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={state === "ok" ? `${visible.length} of ${orders.length} shown` : undefined}
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order no., name, phone, PIN…"
            aria-label="Search orders"
            className={`${inputCls} pl-10`}
          />
        </div>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Filter by status">
          {["", ...ORDER_STATUSES].map((s) => (
            <button
              key={s || "all"}
              type="button"
              aria-pressed={status === s}
              onClick={() => setParam("status", s)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                status === s ? "bg-magenta text-white" : "bg-white/[0.05] text-white/60 hover:text-white"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {state === "loading" ? (
          <LoadingBlock />
        ) : state === "error" ? (
          <ErrorState onRetry={load} message="Couldn't load orders." />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No orders found"
            hint={q || status ? "Try clearing the search or filter." : "New orders will appear here."}
            action={
              (q || status) && (
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    setSearch("");
                    router.replace("/admin/orders");
                  }}
                >
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {visible.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                open={openId === order._id}
                onToggle={() => setExpandedId(openId === order._id ? "" : order._id)}
                onStatus={changeStatus}
              />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function OrderRow({
  order,
  open,
  onToggle,
  onStatus,
}: {
  order: AdminOrder;
  open: boolean;
  onToggle: () => void;
  onStatus: (o: AdminOrder, s: string, tracking?: string) => void;
}) {
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const s = order.shipping ?? {};
  const phone = (s.phone ?? "").replace(/\D/g, "").slice(-10);
  const address = [s.fullName, s.address, `${s.city ?? ""}, ${s.state ?? ""} ${s.pincode ?? ""}`, s.phone]
    .filter(Boolean)
    .join("\n");

  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-8">
          <div className="sm:w-40">
            <p className="text-sm font-semibold text-pink-300">{order.orderNumber}</p>
            <p className="text-xs text-white/45">{fmtDate(order.createdAt)}</p>
          </div>
          <div className="mt-1 min-w-0 sm:mt-0">
            <p className="truncate text-sm font-medium">{s.fullName || "—"}</p>
            <p className="truncate text-xs text-white/45">
              {[s.city, s.state].filter(Boolean).join(", ")} · {order.items?.length ?? 0} item(s)
            </p>
          </div>
        </div>
        <span className="hidden text-sm font-semibold sm:block">{formatPrice(order.total)}</span>
        <StatusBadge status={order.orderStatus} />
        <HiChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="grid gap-6 border-t border-white/[0.06] bg-white/[0.015] px-5 py-5 md:grid-cols-3">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">Items</h3>
            <ul className="space-y-2 text-sm">
              {order.items?.map((item, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-white/80">
                    {item.name} <span className="text-white/45">· {item.size} × {item.quantity}</span>
                  </span>
                  <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-white/[0.06] pt-3 text-sm">
              <div className="flex justify-between text-white/60">
                <dt>Shipping</dt>
                <dd>{order.shippingCost ? formatPrice(order.shippingCost) : "Free"}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd className="text-pink-300">{formatPrice(order.total)}</dd>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <dt>Payment</dt>
                <dd className="uppercase">
                  {order.paymentMethod}
                  {order.paymentStatus && ` · ${order.paymentStatus}`}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">Customer</h3>
            <address className="whitespace-pre-line text-sm not-italic leading-relaxed text-white/75">{address}</address>
            {s.email && <p className="mt-1 text-sm text-white/55">{s.email}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {phone && (
                <>
                  <a href={`tel:+91${phone}`} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                    <HiOutlinePhone size={14} aria-hidden="true" /> Call
                  </a>
                  <a
                    href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                      `Hi ${s.fullName ?? ""}, this is Printala about your order ${order.orderNumber}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnGhost} px-3 py-1.5 text-xs`}
                  >
                    <FaWhatsapp size={14} aria-hidden="true" /> WhatsApp
                  </a>
                </>
              )}
              <button
                type="button"
                className={`${btnGhost} px-3 py-1.5 text-xs`}
                onClick={() => navigator.clipboard.writeText(address).then(() => toast.success("Address copied"))}
              >
                Copy address
              </button>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/45">Status</h3>
            <label htmlFor={`status-${order._id}`} className="sr-only">
              Order status
            </label>
            <select
              id={`status-${order._id}`}
              value={order.orderStatus}
              onChange={(e) => onStatus(order, e.target.value, e.target.value === "shipped" ? tracking.trim() : undefined)}
              className={`${inputCls} capitalize`}
            >
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-[#151518]">
                  {st}
                </option>
              ))}
            </select>

            <label htmlFor={`track-${order._id}`} className="mt-4 mb-1.5 block text-xs text-white/50">
              Courier tracking number
            </label>
            <div className="flex gap-2">
              <input
                id={`track-${order._id}`}
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. AWB123456"
                className={inputCls}
              />
              <button
                type="button"
                disabled={!tracking.trim()}
                onClick={() => onStatus(order, "shipped", tracking.trim())}
                className={`${btnPrimary} shrink-0 px-3`}
              >
                Mark shipped
              </button>
            </div>
          </section>
        </div>
      )}
    </li>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<LoadingBlock />}>
      <OrdersContent />
    </Suspense>
  );
}
