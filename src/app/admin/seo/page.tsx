"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlinePlus } from "react-icons/hi";
import { getAdminProducts } from "@/lib/adminApi";
import { CATEGORIES } from "@/lib/categories";
import {
  TARGET_PER_CATEGORY,
  WEEKLY_GOAL,
  contentChecks,
  contentScore,
} from "@/lib/contentScore";
import { Product } from "@/types";
import { Card, EmptyState, ErrorState, LoadingBlock, PageHeader, btnGhost, useAdminData } from "../ui";

const scoreTone = (s: number) =>
  s >= 80 ? "text-emerald-300 bg-emerald-500/10" : s >= 50 ? "text-amber-300 bg-amber-500/10" : "text-red-300 bg-red-500/10";

export default function AdminSeoPage() {
  const { state, data: loaded, reload } = useAdminData<{ products: Product[]; loadedAt: number }>(
    "seo-products",
    () => getAdminProducts({ limit: "500" }).then((r) => ({ products: r.data || [], loadedAt: Date.now() })),
  );
  const data = loaded?.products;
  const [showAll, setShowAll] = useState(false);

  const rows = useMemo(
    () =>
      (data ?? [])
        .map((p) => {
          const checks = contentChecks(p);
          return { p, checks, score: contentScore(checks) };
        })
        .sort((a, b) => a.score - b.score),
    [data],
  );

  if (state === "loading") return <LoadingBlock />;
  if (state === "error")
    return (
      <Card>
        <ErrorState onRetry={reload} message="Couldn't load products." />
      </Card>
    );

  const products = data ?? [];
  const good = rows.filter((r) => r.score >= 80).length;
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  const weekAgo = (loaded?.loadedAt ?? 0) - 7 * 864e5;
  const thisWeek = products.filter((p) => new Date(p.createdAt).getTime() > weekAgo).length;
  const perCat = CATEGORIES.map((c) => ({
    ...c,
    n: products.filter((p) => (c.slug === "split-poster" ? p.type === "split-poster" : p.category === c.slug)).length,
  })).sort((a, b) => a.n - b.n);
  const visible = showAll ? rows : rows.filter((r) => r.score < 80);

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO health"
        subtitle="Fix the weakest product pages first — specific names, real descriptions and tags are what rank on Google."
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-3xl font-bold">{avg}</p>
          <p className="mt-1 text-sm text-white/60">Average content score / 100</p>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-bold">
            {good}
            <span className="text-lg text-white/40">/{products.length}</span>
          </p>
          <p className="mt-1 text-sm text-white/60">Products in good shape (80+)</p>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-bold">
            {thisWeek}
            <span className="text-lg text-white/40">/{WEEKLY_GOAL}</span>
          </p>
          <p className="mt-1 text-sm text-white/60">New products this week (goal {WEEKLY_GOAL}–10)</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-magenta" style={{ width: `${Math.min(100, (thisWeek / WEEKLY_GOAL) * 100)}%` }} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-3xl font-bold">{perCat.filter((c) => c.n < TARGET_PER_CATEGORY).length}</p>
          <p className="mt-1 text-sm text-white/60">Categories under {TARGET_PER_CATEGORY} products</p>
        </Card>
      </div>

      {/* Category coverage */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-semibold">Category coverage</h2>
        <p className="mt-1 text-sm text-white/50">
          A category page needs about {TARGET_PER_CATEGORY}+ products to compete on Google. Fill the thinnest first.
        </p>
        <ul className="mt-5 space-y-3">
          {perCat.map((c) => (
            <li key={c.slug} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 sm:grid-cols-[10rem_1fr_3rem_auto]">
              <span className="truncate text-sm">{c.name}</span>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full ${c.n >= TARGET_PER_CATEGORY ? "bg-emerald-400" : c.n >= 5 ? "bg-amber-400" : "bg-red-400"}`}
                  style={{ width: `${Math.min(100, (c.n / TARGET_PER_CATEGORY) * 100)}%` }}
                />
              </div>
              <span className="hidden text-right text-sm font-semibold sm:block">{c.n}</span>
              <Link
                href={`/admin/products/new?category=${c.slug}`}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-pink-300 hover:bg-magenta/10"
                aria-label={`Add product to ${c.name}`}
              >
                <HiOutlinePlus size={13} aria-hidden="true" /> Add
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {/* Fix list */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="font-semibold">{showAll ? "All products" : "Needs work"}</h2>
            <p className="text-xs text-white/50">Weakest first · click Fix to open the editor with the checklist</p>
          </div>
          <button type="button" className={`${btnGhost} px-3 py-1.5 text-xs`} onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show only ones needing work" : "Show all"}
          </button>
        </div>
        {visible.length === 0 ? (
          <EmptyState title="Every product page is in good shape 🎉" hint="Keep adding new products every week." />
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {visible.map(({ p, checks, score }) => (
              <li key={p._id} className="flex items-start gap-4 px-5 py-4">
                <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-white/5">
                  {p.image && <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {checks
                      .filter((c) => !c.ok)
                      .map((c) => (
                        <li key={c.key} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/70">
                          {c.label}
                        </li>
                      ))}
                  </ul>
                </div>
                <span className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold ${scoreTone(score)}`}>{score}</span>
                <Link
                  href={`/admin/products/${p._id}`}
                  className="shrink-0 rounded-lg bg-magenta px-3 py-1.5 text-xs font-semibold text-white hover:bg-magenta-light"
                >
                  Fix
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
