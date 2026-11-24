"use client";

/* Shared admin UI kit — one place for cards, badges, inputs and states. */
import { ReactNode, useEffect, useRef, useState } from "react";

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_STYLE: Record<string, string> = {
  placed: "bg-blue-500/10 text-blue-300 ring-blue-500/25",
  confirmed: "bg-cyan-500/10 text-cyan-300 ring-cyan-500/25",
  processing: "bg-amber-500/10 text-amber-300 ring-amber-500/25",
  shipped: "bg-violet-500/10 text-violet-300 ring-violet-500/25",
  delivered: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/25",
  cancelled: "bg-red-500/10 text-red-300 ring-red-500/25",
};

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/20";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-magenta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-magenta-light disabled:cursor-not-allowed disabled:opacity-50";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white disabled:opacity-50";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-[#151518] ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
        STATUS_STYLE[status ?? ""] ?? "bg-white/5 text-white/60 ring-white/10"
      }`}
    >
      {status ?? "—"}
    </span>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "red" | "amber" | "pink" | "sky" | "violet" | "neutral" }) {
  const tones = {
    green: "bg-emerald-500/10 text-emerald-300",
    red: "bg-red-500/10 text-red-300",
    amber: "bg-amber-500/10 text-amber-300",
    pink: "bg-magenta/15 text-pink-300",
    sky: "bg-sky/15 text-sky-light",
    violet: "bg-violet-500/10 text-violet-300",
    neutral: "bg-white/5 text-white/60",
  };
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`h-8 w-8 animate-spin rounded-full border-2 border-magenta/30 border-t-magenta ${className}`}
    />
  );
}

export function LoadingBlock() {
  return (
    <div className="flex justify-center py-16">
      <Spinner />
    </div>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-semibold text-white/80">{title}</p>
      {hint && <p className="mt-1 text-sm text-white/45">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry, message = "Couldn't load data." }: { onRetry: () => void; message?: string }) {
  return (
    <EmptyState
      title={message}
      hint="The server may be waking up — this can take up to a minute."
      action={
        <button type="button" onClick={onRetry} className={btnGhost}>
          Try again
        </button>
      }
    />
  );
}

export function Field({
  id,
  label,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/55">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

export const fmtDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

/**
 * Fetch helper for admin pages. `key` identifies the request (e.g. a filter);
 * state is "loading" until the response for the current key arrives.
 */
export function useAdminData<T>(key: string, fetcher: () => Promise<T>) {
  const [res, setRes] = useState<{ key: string; data?: T; error?: boolean }>({ key: "" });
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });
  const reqKey = `${key}#${nonce}`;

  useEffect(() => {
    let alive = true;
    fetcherRef.current().then(
      (data) => alive && setRes({ key: reqKey, data }),
      () => alive && setRes({ key: reqKey, error: true }),
    );
    return () => {
      alive = false;
    };
  }, [reqKey]);

  const state: "loading" | "ok" | "error" =
    res.key !== reqKey ? "loading" : res.error ? "error" : "ok";

  return {
    state,
    data: res.data,
    reload: () => setNonce((n) => n + 1),
    /** Optimistic local update of the loaded data. */
    mutate: (fn: (d: T) => T) => setRes((r) => (r.data === undefined ? r : { ...r, data: fn(r.data) })),
  };
}
