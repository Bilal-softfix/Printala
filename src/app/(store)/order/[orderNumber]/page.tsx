"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import { trackOrder } from "@/lib/api";
import { rupees } from "@/lib/cart";
import { SITE } from "@/lib/site";
import { trackUrl } from "@/lib/orders";
import toast from "react-hot-toast";
import { HiOutlineClipboardCopy, HiOutlineLink } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa6";

type OrderView = {
  orderNumber: string;
  orderStatus?: string;
  items?: { name: string; size: string; quantity: number; price: number }[];
  shippingCost?: number;
  total?: number;
};

const LABEL = "text-xs uppercase tracking-[0.2em] text-ink-text/70";

export default function OrderPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const id = decodeURIComponent(orderNumber);
  const [order, setOrder] = useState<OrderView | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [justPlaced, setJustPlaced] = useState(false);

  useEffect(() => {
    let local: OrderView | null = null;
    try {
      const raw = sessionStorage.getItem(`order:${id}`);
      if (raw) local = JSON.parse(raw);
    } catch {}

    trackOrder(id)
      .then((res) => {
        setOrder({ ...local, ...res.data, orderNumber: id });
        setJustPlaced(!!local);
        setState("ok");
      })
      .catch(() => {
        setOrder(local);
        setJustPlaced(!!local);
        setState(local ? "ok" : "missing");
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main max-w-3xl">
        {state === "loading" && <p className="text-sm text-ink-text/70">Loading your order…</p>}

        {state === "missing" && (
          <>
            <SectionHeading as="h1" index="—" eyebrow="Order lookup" lines={["Order not found."]} />
            <p className="mt-6 text-[15px] text-ink-text/75">
              We couldn&apos;t find order <strong>{id}</strong>. Check the number, or call us at{" "}
              <a href={SITE.phoneHref} className="underline underline-offset-4">
                {SITE.phone}
              </a>
              .
            </p>
            <Link href="/track" className="btn-ink mt-8">
              Try another number
            </Link>
          </>
        )}

        {state === "ok" && order && (
          <>
            <SectionHeading
              as="h1"
              index="—"
              eyebrow={justPlaced ? "Order confirmed" : "Order status"}
              lines={[justPlaced ? "Thank you!" : "Your order."]}
            />
            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-black/10 py-6 text-sm sm:grid-cols-3">
              <div>
                <dt className={LABEL}>Order number</dt>
                <dd className="mt-1.5 font-semibold">{order.orderNumber}</dd>
              </div>
              <div>
                <dt className={LABEL}>Status</dt>
                <dd className="mt-1.5 font-semibold capitalize">{order.orderStatus ?? "Placed"}</dd>
              </div>
              <div>
                <dt className={LABEL}>Payment</dt>
                <dd className="mt-1.5 font-semibold">Cash on Delivery</dd>
              </div>
            </dl>

            {order.items && order.items.length > 0 && (
              <ul className="mt-8 space-y-3 text-sm">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>
                      {it.name}{" "}
                      <span className="text-ink-text/70">
                        · {it.size} × {it.quantity}
                      </span>
                    </span>
                    <span className="shrink-0">{rupees(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}

            {typeof order.total === "number" && (
              <dl className="mt-6 space-y-2 border-t border-black/10 pt-5 text-sm">
                {typeof order.shippingCost === "number" && (
                  <div className="flex justify-between text-ink-text/75">
                    <dt>Shipping</dt>
                    <dd>{order.shippingCost === 0 ? "Free" : rupees(order.shippingCost)}</dd>
                  </div>
                )}
                <div className="flex justify-between font-display text-2xl font-bold">
                  <dt>Total</dt>
                  <dd>{rupees(order.total)}</dd>
                </div>
              </dl>
            )}

            {justPlaced && <SaveOrderCard orderNumber={order.orderNumber} />}

            <p className="mt-10 text-[15px] leading-relaxed text-ink-text/75">
              Track this order anytime at{" "}
              <Link href={trackUrl(order.orderNumber)} className="underline underline-offset-4">
                printala.in/track
              </Link>
              . Questions? Call or WhatsApp{" "}
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {SITE.phone}
              </a>{" "}
              ({SITE.hours}).
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-ink">
                Continue shopping
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink-text"
              >
                Track an order
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Prominent "keep your order number" card shown right after checkout. */
function SaveOrderCard({ orderNumber }: { orderNumber: string }) {
  const link = `${window.location.origin}${trackUrl(orderNumber)}`;
  const copy = (text: string, msg: string) =>
    navigator.clipboard.writeText(text).then(() => toast.success(msg), () => toast.error("Couldn't copy"));
  const btn =
    "inline-flex items-center gap-2 rounded-full border border-black/15 bg-paper px-4 py-2.5 text-sm font-medium transition-colors hover:border-ink-text";

  return (
    <section
      aria-labelledby="save-order-heading"
      className="mt-8 border-2 border-accent/40 bg-accent/[0.06] p-6"
    >
      <h2 id="save-order-heading" className="font-display text-xl font-bold tracking-[-0.02em]">
        Save your order number
      </h2>
      <p className="mt-2 text-[15px] text-ink-text/75">
        You&apos;ll need <strong className="text-ink-text">{orderNumber}</strong> to track your order.
        Take a screenshot, or save it with one tap:
      </p>
      <p className="mt-4 select-all font-display text-3xl font-bold tracking-tight">{orderNumber}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => copy(orderNumber, "Order number copied")} className={btn}>
          <HiOutlineClipboardCopy size={16} aria-hidden="true" /> Copy number
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `My Printala order: ${orderNumber}\nTrack it here: ${link}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btn}
        >
          <FaWhatsapp size={16} aria-hidden="true" /> Send to my WhatsApp
        </a>
        <button type="button" onClick={() => copy(link, "Tracking link copied")} className={btn}>
          <HiOutlineLink size={16} aria-hidden="true" /> Copy tracking link
        </button>
      </div>
      <p className="mt-4 text-xs text-ink-text/70">
        It&apos;s also saved on this device — just open the Track Order page.
      </p>
    </section>
  );
}
