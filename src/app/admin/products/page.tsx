"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineExternalLink,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { getAdminProducts, deleteProduct } from "@/lib/adminApi";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import { Product } from "@/types";
import {
  Card,
  EmptyState,
  ErrorState,
  LoadingBlock,
  PageHeader,
  Tag,
  btnPrimary,
  inputCls,
  useAdminData,
} from "../ui";

const STOCK_FILTERS = [
  { value: "", label: "All" },
  { value: "in", label: "In stock" },
  { value: "out", label: "Out of stock" },
  { value: "featured", label: "Featured" },
];

export default function AdminProductsPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Debounce: query the API 300ms after typing stops, not on every key.
  useEffect(() => {
    const t = setTimeout(() => setSearch(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { state, data, reload: load, mutate } = useAdminData<Product[]>(`products:${search}`, () =>
    getAdminProducts({ limit: "200", ...(search ? { search } : {}) }).then((r) => r.data || []),
  );
  const products = useMemo(() => data ?? [], [data]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products],
  );

  const visible = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (stock === "in" ? p.inStock : stock === "out" ? !p.inStock : stock === "featured" ? p.featured : true),
  );

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeleting(p._id);
    try {
      await deleteProduct(p._id);
      mutate((list) => list.filter((x) => x._id !== p._id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={state === "ok" ? `${visible.length} of ${products.length} shown` : undefined}
        actions={
          <Link href="/admin/products/new" className={btnPrimary}>
            <HiOutlinePlus size={18} aria-hidden="true" /> Add product
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" size={17} aria-hidden="true" />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className={`${inputCls} pl-10`}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className={`${inputCls} capitalize lg:w-48`}
        >
          <option value="" className="bg-[#151518]">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#151518]">
              {c.replace("-", " ")}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5" role="group" aria-label="Filter by stock">
          {STOCK_FILTERS.map((f) => (
            <button
              key={f.value || "all"}
              type="button"
              aria-pressed={stock === f.value}
              onClick={() => setStock(f.value)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                stock === f.value ? "bg-magenta text-white" : "bg-white/[0.05] text-white/60 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        {state === "loading" ? (
          <LoadingBlock />
        ) : state === "error" ? (
          <ErrorState onRetry={load} message="Couldn't load products." />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No products found"
            hint={products.length ? "Try a different search or filter." : "Add your first product to get started."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-white/45">
                  <th scope="col" className="px-5 py-3 font-semibold">Product</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Category</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Price</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {visible.map((p) => (
                  <tr key={p._id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/products/${p._id}`} className="flex items-center gap-3">
                        <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md bg-white/5">
                          {p.image && <Image src={p.image} alt="" fill sizes="44px" className="object-cover" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-[260px] truncate font-medium hover:text-pink-300">{p.name}</span>
                          <span className="text-xs text-white/45">
                            {p.type === "split-poster" ? `${p.panels ?? 3}-panel split` : "Poster"} · {p.sizes?.length ?? 0} sizes
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3 capitalize text-white/70">{p.category.replace("-", " ")}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="font-medium">{formatPrice(p.price)}</span>
                      {p.comparePrice ? (
                        <span className="ml-2 text-xs text-white/40 line-through">{formatPrice(p.comparePrice)}</span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.inStock ? <Tag tone="green">In stock</Tag> : <Tag tone="red">Out of stock</Tag>}
                        {p.featured && <Tag tone="amber">Featured</Tag>}
                        {p.bestseller && <Tag tone="pink">Bestseller</Tag>}
                        {p.isNew && <Tag tone="sky">New</Tag>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <a
                          href={`/product/${p._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${p.name} in store`}
                          title="View in store"
                          className="rounded-lg p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <HiOutlineExternalLink size={16} />
                        </a>
                        <Link
                          href={`/admin/products/${p._id}`}
                          aria-label={`Edit ${p.name}`}
                          title="Edit"
                          className="rounded-lg p-2 text-white/45 transition-colors hover:bg-white/5 hover:text-sky-light"
                        >
                          <HiOutlinePencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          disabled={deleting === p._id}
                          aria-label={`Delete ${p.name}`}
                          title="Delete"
                          className="rounded-lg p-2 text-white/45 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
                        >
                          <HiOutlineTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
