"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/adminApi";
import { fetchProductById } from "@/lib/api";
// import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import ImageUploader from "../../ImageUploader";

const CATEGORIES = [
  "anime",
  "gaming",
  "cricket",
  "cars",
  "bollywood",
  "football",
  "anime-girls",
  "sports",
  "music",
  "split-poster",
];

const DEFAULT_SIZES = [
  { label: "A4", dimensions: "21 × 29.7 cm", priceModifier: 0 },
  { label: "A3", dimensions: "29.7 × 42 cm", priceModifier: 100 },
  { label: "A2", dimensions: "42 × 59.4 cm", priceModifier: 250 },
  { label: "A1", dimensions: "59.4 × 84.1 cm", priceModifier: 450 },
];

const SPLIT_SIZES = [
  { label: "Small", dimensions: "Each panel 20 × 40 cm", priceModifier: 0 },
  { label: "Medium", dimensions: "Each panel 30 × 60 cm", priceModifier: 400 },
  { label: "Large", dimensions: "Each panel 40 × 80 cm", priceModifier: 800 },
];

export default function ProductFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    image: "",
    category: "anime",
    tags: "",
    type: "poster",
    panels: "3",
    inStock: true,
    featured: false,
    bestseller: false,
    isNew: false,
  });

  useEffect(() => {
    if (!isNew) {
      const load = async () => {
        try {
          const result = await fetchProductById(id as string);
          const p = result.data;
          setForm({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price.toString(),
            comparePrice: p.comparePrice?.toString() || "",
            image: p.image,
            category: p.category,
            tags: p.tags?.join(", ") || "",
            type: p.type,
            panels: p.panels?.toString() || "3",
            inStock: p.inStock,
            featured: p.featured,
            bestseller: p.bestseller || false,
            isNew: p.isNew || false,
          });
        } catch {
          toast.error("Product load nahi ho paya");
          router.push("/admin/products");
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [id, isNew, router]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image) {
      toast.error("Image upload karo pehle!");
      return;
    }

    setSaving(true);

    try {
      const sizes = form.type === "split-poster" ? SPLIT_SIZES : DEFAULT_SIZES;

      const productData = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        image: form.image,
        category: form.category,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sizes,
        type: form.type,
        panels: form.type === "split-poster" ? parseInt(form.panels) : null,
        inStock: form.inStock,
        featured: form.featured,
        bestseller: form.bestseller,
        isNew: form.isNew,
      };

      if (isNew) {
        await createProduct(productData);
        toast.success("Product create ho gaya! 🎉");
      } else {
        await updateProduct(id as string, productData);
        toast.success("Product update ho gaya! ✅");
      }

      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-magenta/30 border-t-magenta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-white text-2xl font-bold mb-8">
        {isNew ? "➕ Add New Product" : "✏️ Edit Product"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column: Image ── */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6 sticky top-28">
              <ImageUploader
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="Product Image"
              />
            </div>
          </div>

          {/* ── Right Column: Form Fields ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold flex items-center gap-2">
                📝 Basic Info
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Product Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors"
                    placeholder="Naruto Sage Mode Poster"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Slug (URL)
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#1A1A1D]">
                        {c.charAt(0).toUpperCase() +
                          c.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors resize-none"
                    placeholder="Describe the poster in detail..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors"
                    placeholder="naruto, anime, shonen, hokage"
                  />
                  {form.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.tags
                        .split(",")
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag.trim()}
                            className="px-2 py-0.5 bg-magenta/10 text-magenta text-xs rounded-md font-medium"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold flex items-center gap-2">
                💰 Pricing & Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      required
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                                 focus:outline-none focus:border-magenta transition-colors"
                      placeholder="199"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Compare Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={form.comparePrice}
                      onChange={(e) =>
                        setForm({ ...form, comparePrice: e.target.value })
                      }
                      min="0"
                      className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                                 focus:outline-none focus:border-magenta transition-colors"
                      placeholder="399 (strikethrough price)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
                        category:
                          e.target.value === "split-poster"
                            ? "split-poster"
                            : form.category === "split-poster"
                              ? "anime"
                              : form.category,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                               focus:outline-none focus:border-magenta transition-colors"
                  >
                    <option value="poster" className="bg-[#1A1A1D]">
                      🖼️ Single Poster
                    </option>
                    <option value="split-poster" className="bg-[#1A1A1D]">
                      🖼️🖼️🖼️ Split Poster
                    </option>
                  </select>
                </div>

                {form.type === "split-poster" && (
                  <div>
                    <label className="block text-white/50 text-xs font-bold uppercase mb-2">
                      Panels
                    </label>
                    <select
                      value={form.panels}
                      onChange={(e) =>
                        setForm({ ...form, panels: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                                 focus:outline-none focus:border-magenta transition-colors"
                    >
                      <option value="3" className="bg-[#1A1A1D]">
                        3 Panels
                      </option>
                      <option value="5" className="bg-[#1A1A1D]">
                        5 Panels
                      </option>
                    </select>
                  </div>
                )}
              </div>

              {/* Price Preview */}
              {form.price && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-white/40 text-xs font-bold uppercase mb-2">
                    Price Preview
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-magenta font-bold text-2xl">
                      ₹{parseInt(form.price).toLocaleString("en-IN")}
                    </span>
                    {form.comparePrice && (
                      <>
                        <span className="text-white/30 line-through">
                          ₹{parseInt(form.comparePrice).toLocaleString("en-IN")}
                        </span>
                        <span className="text-green-400 text-sm font-bold">
                          {Math.round(
                            ((parseInt(form.comparePrice) -
                              parseInt(form.price)) /
                              parseInt(form.comparePrice)) *
                              100,
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-white/30">
                    {(form.type === "split-poster"
                      ? SPLIT_SIZES
                      : DEFAULT_SIZES
                    ).map((s) => (
                      <span key={s.label}>
                        {s.label}: ₹
                        {(
                          parseInt(form.price || "0") + s.priceModifier
                        ).toLocaleString("en-IN")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Flags */}
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                🏷️ Flags & Badges
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    key: "inStock",
                    label: "In Stock",
                    desc: "Product available for purchase",
                    color: "green",
                  },
                  {
                    key: "featured",
                    label: "Featured",
                    desc: "Shows on homepage",
                    color: "yellow",
                  },
                  {
                    key: "bestseller",
                    label: "Bestseller",
                    desc: "Shows bestseller badge",
                    color: "magenta",
                  },
                  {
                    key: "isNew",
                    label: "New Badge",
                    desc: "Shows NEW tag",
                    color: "sky",
                  },
                ].map((flag) => {
                  const isChecked = form[
                    flag.key as keyof typeof form
                  ] as boolean;
                  return (
                    <label
                      key={flag.key}
                      className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          isChecked
                            ? `border-${flag.color === "magenta" ? "magenta" : flag.color === "yellow" ? "yellow" : flag.color === "sky" ? "sky" : "green-500"}/40 bg-${flag.color === "magenta" ? "magenta" : flag.color === "yellow" ? "yellow" : flag.color === "sky" ? "sky" : "green-500"}/5`
                            : "border-white/10 bg-transparent hover:border-white/20"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            setForm({ ...form, [flag.key]: e.target.checked })
                          }
                          className="w-4 h-4 rounded accent-magenta"
                        />
                        <span className="text-white text-sm font-bold">
                          {flag.label}
                        </span>
                      </div>
                      <span className="text-white/30 text-xs">{flag.desc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving || !form.image}
                className="px-8 py-3.5 bg-magenta text-white font-bold rounded-xl
                           hover:bg-magenta-light transition-colors disabled:opacity-50
                           flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : isNew ? (
                  "✅ Create Product"
                ) : (
                  "💾 Update Product"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="px-8 py-3.5 bg-white/5 text-white/60 font-bold rounded-xl
                           hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
