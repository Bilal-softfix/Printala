"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { HiOutlineArrowLeft, HiOutlineExternalLink, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import { createProduct, updateProduct } from "@/lib/adminApi";
import { fetchProductById } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import { Size } from "@/types";
import { contentChecks, contentScore, draftDescription, suggestTags } from "@/lib/contentScore";
import ImageUploader from "../../ImageUploader";
import { Card, Field, LoadingBlock, PageHeader, btnGhost, btnPrimary, inputCls } from "../../ui";

/* Store categories + legacy ones some products may still use. */
const CATEGORY_OPTIONS = [
  ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
];

const POSTER_SIZES: Size[] = [
  { label: "A4", dimensions: "21 × 29.7 cm", priceModifier: 0 },
  { label: "A3", dimensions: "29.7 × 42 cm", priceModifier: 100 },
  { label: "A2", dimensions: "42 × 59.4 cm", priceModifier: 250 },
  { label: "A1", dimensions: "59.4 × 84.1 cm", priceModifier: 450 },
];

const SPLIT_SIZES: Size[] = [
  { label: "Small", dimensions: "Each panel 20 × 40 cm", priceModifier: 0 },
  { label: "Medium", dimensions: "Each panel 30 × 60 cm", priceModifier: 400 },
  { label: "Large", dimensions: "Each panel 40 × 80 cm", priceModifier: 800 },
];

const FLAGS = [
  { key: "inStock", label: "In stock", desc: "Can be purchased" },
  { key: "featured", label: "Featured", desc: "Shown on homepage" },
  { key: "bestseller", label: "Bestseller", desc: "Bestseller badge" },
  { key: "isNew", label: "New", desc: "NEW badge" },
] as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  price: "",
  comparePrice: "",
  image: "",
  category: "anime",
  tags: "",
  type: "poster" as "poster" | "split-poster",
  panels: "3",
  inStock: true,
  featured: false,
  bestseller: false,
  isNew: false,
};

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const [form, setForm] = useState(() => {
    const cat = isNew ? searchParams.get("category") : null;
    return cat
      ? { ...EMPTY, category: cat, ...(cat === "split-poster" ? { type: "split-poster" as const } : {}) }
      : EMPTY;
  });
  const [sizes, setSizes] = useState<Size[]>(POSTER_SIZES);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    fetchProductById(id)
      .then((result) => {
        const p = result.data;
        setForm({
          name: p.name,
          slug: p.slug ?? "",
          description: p.description ?? "",
          price: String(p.price),
          comparePrice: p.comparePrice ? String(p.comparePrice) : "",
          image: p.image,
          category: p.category,
          tags: p.tags?.join(", ") || "",
          type: p.type,
          panels: String(p.panels ?? 3),
          inStock: p.inStock,
          featured: p.featured,
          bestseller: !!p.bestseller,
          isNew: !!p.isNew,
        });
        // Keep the product's own sizes (previously overwritten on every save).
        setSizes(p.sizes?.length ? p.sizes : p.type === "split-poster" ? SPLIT_SIZES : POSTER_SIZES);
      })
      .catch(() => {
        toast.error("Couldn't load product.");
        router.push("/admin/products");
      })
      .finally(() => setLoading(false));
  }, [id, isNew, router]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setType = (type: "poster" | "split-poster") => {
    set("type", type);
    // Swap presets only for new products, so existing custom sizes are never lost.
    if (isNew) setSizes(type === "split-poster" ? SPLIT_SIZES : POSTER_SIZES);
  };

  const updateSize = (i: number, patch: Partial<Size>) =>
    setSizes((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const price = Number(form.price) || 0;
  const compare = Number(form.comparePrice) || 0;
  const categoryOptions = CATEGORY_OPTIONS.some((c) => c.value === form.category)
    ? CATEGORY_OPTIONS
    : [...CATEGORY_OPTIONS, { value: form.category, label: form.category }];

  // Search-visibility checklist (shared with the SEO health page).
  const seoChecks = contentChecks(form);
  const seoScore = contentScore(seoChecks);
  const categoryName = CATEGORY_OPTIONS.find((c) => c.value === form.category)?.label ?? form.category;
  const tagList = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  const writeDraft = () => {
    if (!form.name.trim()) return toast.error("Enter the product name first.");
    if (form.description.trim().length > 40 && !confirm("Replace the current description with a draft?")) return;
    set(
      "description",
      draftDescription({ name: form.name.trim(), categoryName, type: form.type, panels: form.panels, sizes, tags: tagList }),
    );
    toast.success("Draft added — now add the character, series and mood in your own words.");
  };

  const addSuggestedTags = () => {
    if (!form.name.trim()) return toast.error("Enter the product name first.");
    const merged = [...new Set([...tagList, ...suggestTags(form.name, form.category, form.type)])];
    set("tags", merged.join(", "));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) return toast.error("Please upload an image first.");
    if (compare && compare <= price) return toast.error("Compare-at price must be higher than the price.");
    const cleanSizes = sizes
      .map((s) => ({ ...s, label: s.label.trim(), dimensions: s.dimensions.trim(), priceModifier: Number(s.priceModifier) || 0 }))
      .filter((s) => s.label);
    if (!cleanSizes.length) return toast.error("Add at least one size.");
    if (new Set(cleanSizes.map((s) => s.label.toLowerCase())).size !== cleanSizes.length)
      return toast.error("Size names must be unique.");

    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        description: form.description,
        price,
        comparePrice: compare || null,
        image: form.image,
        category: form.category,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        sizes: cleanSizes,
        type: form.type,
        panels: form.type === "split-poster" ? Number(form.panels) : null,
        inStock: form.inStock,
        featured: form.featured,
        bestseller: form.bestseller,
        isNew: form.isNew,
      };
      if (isNew) await createProduct(data);
      else await updateProduct(id, data);
      toast.success(isNew ? "Product created" : "Product updated");
      router.push("/admin/products");
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock />;

  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-white">
        <HiOutlineArrowLeft size={15} aria-hidden="true" /> All products
      </Link>
      <PageHeader
        title={isNew ? "Add product" : "Edit product"}
        actions={
          !isNew && (
            <a href={`/product/${id}`} target="_blank" rel="noopener noreferrer" className={btnGhost}>
              View in store <HiOutlineExternalLink size={14} aria-hidden="true" />
            </a>
          )
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="space-y-6 lg:sticky lg:top-20">
            <Card className="p-5">
              <ImageUploader value={form.image} onChange={(url) => set("image", url)} label="Main image" />
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Search visibility</h2>
                <span
                  className={`rounded-lg px-2.5 py-1 text-sm font-bold ${
                    seoScore >= 80 ? "bg-emerald-500/10 text-emerald-300" : seoScore >= 50 ? "bg-amber-500/10 text-amber-300" : "bg-red-500/10 text-red-300"
                  }`}
                >
                  {seoScore}/100
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {seoChecks.map((c) => (
                  <li key={c.key} className="flex gap-2">
                    <span aria-hidden="true" className={c.ok ? "text-emerald-300" : "text-amber-300"}>
                      {c.ok ? "✓" : "!"}
                    </span>
                    <span className={c.ok ? "text-white/50" : "text-white/85"}>{c.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-white/40">Example name: “Gojo Satoru Jujutsu Kaisen Poster”</p>
            </Card>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="font-semibold">Details</h2>
            <Field id="name" label="Product name *">
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, ...(slugTouched ? {} : { slug: slugify(name) }) }));
                }}
                placeholder="e.g. Naruto Sage Mode"
                className={inputCls}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="slug" label="URL slug" hint={isNew ? "Generated from the name" : "Changing it may break old links"}>
                <input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className={inputCls}
                />
              </Field>
              <Field id="category" label="Category *">
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputCls}
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value} className="bg-[#151518]">
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field
              id="description"
              label="Description"
              hint={`${form.description.trim().length} characters · aim for 150–600. Mention the character, series, mood and where it suits.`}
            >
              <div className="mb-2 flex justify-end">
                <button type="button" onClick={writeDraft} className={`${btnGhost} px-3 py-1.5 text-xs`}>
                  ✨ Write a draft for me
                </button>
              </div>
              <textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="What makes this poster special? Shown on the product page and in Google results."
                className={`${inputCls} resize-y`}
              />
            </Field>
            <Field id="tags" label="Tags" hint="Comma separated, e.g. naruto, anime, orange">
              <div className="flex gap-2">
                <input id="tags" value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} />
                <button type="button" onClick={addSuggestedTags} className={`${btnGhost} shrink-0 px-3 text-xs`}>
                  Suggest tags
                </button>
              </div>
            </Field>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="font-semibold">Pricing &amp; format</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="price" label="Base price (₹) *" hint="Price of the smallest size">
                <input
                  id="price"
                  type="number"
                  min={1}
                  required
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field
                id="comparePrice"
                label="Compare-at price (₹)"
                hint={compare > price && price ? `Shows ${Math.round(((compare - price) / compare) * 100)}% off` : "Optional, original price"}
              >
                <input
                  id="comparePrice"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form.comparePrice}
                  onChange={(e) => set("comparePrice", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field id="type" label="Type">
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setType(e.target.value as "poster" | "split-poster")}
                  className={inputCls}
                >
                  <option value="poster" className="bg-[#151518]">Single poster</option>
                  <option value="split-poster" className="bg-[#151518]">Split poster</option>
                </select>
              </Field>
              {form.type === "split-poster" && (
                <Field id="panels" label="Panels">
                  <select id="panels" value={form.panels} onChange={(e) => set("panels", e.target.value)} className={inputCls}>
                    {["2", "3", "4", "5"].map((n) => (
                      <option key={n} value={n} className="bg-[#151518]">
                        {n} panels
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/55">Sizes</h3>
                <div className="flex gap-2">
                  <button type="button" className={`${btnGhost} px-3 py-1.5 text-xs`} onClick={() => setSizes(POSTER_SIZES)}>
                    Use A4–A1
                  </button>
                  <button type="button" className={`${btnGhost} px-3 py-1.5 text-xs`} onClick={() => setSizes(SPLIT_SIZES)}>
                    Use split presets
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="hidden grid-cols-[1fr_1.6fr_7rem_6rem_2.25rem] gap-2 px-1 text-xs text-white/45 sm:grid">
                  <span>Name</span>
                  <span>Dimensions</span>
                  <span>+ Price (₹)</span>
                  <span>Final</span>
                  <span />
                </div>
                {sizes.map((s, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.02] p-2 sm:grid-cols-[1fr_1.6fr_7rem_6rem_2.25rem] sm:items-center sm:bg-transparent sm:p-0">
                    <input
                      aria-label={`Size ${i + 1} name`}
                      value={s.label}
                      onChange={(e) => updateSize(i, { label: e.target.value })}
                      placeholder="A3"
                      className={inputCls}
                    />
                    <input
                      aria-label={`Size ${i + 1} dimensions`}
                      value={s.dimensions}
                      onChange={(e) => updateSize(i, { dimensions: e.target.value })}
                      placeholder="29.7 × 42 cm"
                      className={inputCls}
                    />
                    <input
                      aria-label={`Size ${i + 1} extra price`}
                      type="number"
                      min={0}
                      value={s.priceModifier}
                      onChange={(e) => updateSize(i, { priceModifier: Number(e.target.value) })}
                      className={inputCls}
                    />
                    <span className="px-1 text-sm font-semibold">{formatPrice(price + (Number(s.priceModifier) || 0))}</span>
                    <button
                      type="button"
                      onClick={() => setSizes((list) => list.filter((_, j) => j !== i))}
                      disabled={sizes.length === 1}
                      aria-label={`Remove size ${s.label || i + 1}`}
                      className="justify-self-end rounded-lg p-2 text-white/45 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-30"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSizes((list) => [...list, { label: "", dimensions: "", priceModifier: 0 }])}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-pink-300 hover:underline"
              >
                <HiOutlinePlus size={15} aria-hidden="true" /> Add size
              </button>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 font-semibold">Visibility &amp; badges</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {FLAGS.map((f) => {
                const on = form[f.key];
                return (
                  <label
                    key={f.key}
                    className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-magenta/40 ${
                      on ? "border-magenta/50 bg-magenta/10" : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) => set(f.key, e.target.checked)}
                        className="h-4 w-4 accent-magenta"
                      />
                      <span className="text-sm font-semibold">{f.label}</span>
                    </span>
                    <span className="mt-1 text-xs text-white/45">{f.desc}</span>
                  </label>
                );
              })}
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving || !form.image} className={btnPrimary}>
              {saving ? "Saving…" : isNew ? "Create product" : "Save changes"}
            </button>
            <Link href="/admin/products" className={btnGhost}>
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
