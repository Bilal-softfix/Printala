"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SavedOrder } from "@/lib/orders";
import { rupees } from "@/lib/cart";

// Read saved orders without a hydration mismatch (server snapshot = none).
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = () => {
  try {
    return localStorage.getItem("printala-orders") || "[]";
  } catch {
    return "[]";
  }
};

export default function TrackForm() {
  const params = useSearchParams();
  const fromLink = params.get("order")?.trim() ?? "";
  const [value, setValue] = useState(fromLink);
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  let saved: SavedOrder[] = [];
  try {
    saved = JSON.parse(raw);
  } catch {}

  // Shared tracking links (/track?order=XYZ) open the order straight away.
  useEffect(() => {
    if (fromLink) router.replace(`/order/${encodeURIComponent(fromLink)}`);
  }, [fromLink, router]);

  return (
    <>
      <form
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const id = value.trim();
          if (id) router.push(`/order/${encodeURIComponent(id)}`);
        }}
      >
        <div className="flex-1">
          <label htmlFor="orderNumber" className="field-label">
            Order number
          </label>
          <input
            id="orderNumber"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="Your order number"
            className="field"
          />
        </div>
        <button type="submit" className="btn-ink">
          Track order
        </button>
      </form>

      {saved.length > 0 && (
        <section aria-labelledby="recent-orders" className="mt-12">
          <h2 id="recent-orders" className="text-xs uppercase tracking-[0.26em] text-ink-text/70">
            Your recent orders on this device
          </h2>
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {saved.map((o) => (
              <li key={o.orderNumber}>
                <Link
                  href={`/order/${encodeURIComponent(o.orderNumber)}`}
                  className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
                >
                  <span>
                    <span className="block font-semibold">{o.orderNumber}</span>
                    <span className="text-xs text-ink-text/70">
                      {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {typeof o.total === "number" && ` · ${rupees(o.total)}`}
                    </span>
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
