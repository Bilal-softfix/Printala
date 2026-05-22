"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
} from "react-icons/hi";
import { getAdminProducts, deleteProduct } from "@/lib/adminApi";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    try {
      const params: Record<string, string> = { limit: "100" };
      if (search) params.search = search;
      const result = await getAdminProducts(params);
      setProducts(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" delete karna hai? Ye wapas nahi aayega!`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      toast.success("Product deleted! 🗑️");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">Products</h1>
          <p className="text-white/40 text-sm">
            {products.length} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-magenta text-white rounded-xl
                     font-bold text-sm hover:bg-magenta-light transition-colors"
        >
          <HiOutlinePlus size={18} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <HiOutlineSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 bg-[#1A1A1D] border border-white/10 rounded-xl
                     text-white placeholder-white/30 focus:outline-none focus:border-magenta text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-magenta/30 border-t-magenta rounded-full animate-spin mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-white/30">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left px-6 py-4">Product</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Price</th>
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-right px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-white/30 text-xs">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60 capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-white/30 text-xs line-through ml-2">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            product.type === "split-poster"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-sky/10 text-sky"
                          }`}
                        >
                          {product.type === "split-poster"
                            ? `${product.panels}P Split`
                            : "Poster"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {product.inStock ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400">
                              In Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400">
                              Out of Stock
                            </span>
                          )}
                          {product.featured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow/10 text-yellow">
                              Featured
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-magenta/10 text-magenta">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-sky transition-colors"
                          >
                            <HiOutlinePencil size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(product._id, product.name)
                            }
                            disabled={deleting === product._id}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400
                                       transition-colors disabled:opacity-30"
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
