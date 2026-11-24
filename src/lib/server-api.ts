import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product } from "@/types";

/* Server-side data access with ISR caching. Falls back to static data only
   when the API is unreachable (not when it answers 404). */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://printala-api.onrender.com/api";
const REVALIDATE = 300;

class NotFoundError extends Error {}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? `?${new URLSearchParams(params)}` : "";
  const res = await fetch(`${API_URL}${path}${qs}`, {
    next: { revalidate: REVALIDATE },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(`API ${res.status} ${path}`);
  const json = await res.json();
  return json.data as T;
}

/** Returns the product, or null if it doesn't exist. */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    return (await get<Product>(`/products/${encodeURIComponent(id)}`)) ?? null;
  } catch (err) {
    if (err instanceof NotFoundError) return null;
    return FALLBACK.find((p) => p._id === id) ?? null;
  }
}

export async function getRelated(product: Product): Promise<Product[]> {
  try {
    return (await get<Product[]>(`/products/${product._id}/related`)) ?? [];
  } catch {
    return FALLBACK.filter(
      (p) => p.category === product.category && p._id !== product._id,
    ).slice(0, 4);
  }
}

/** Product list; `null` means the API failed (caller decides on fallback). */
export async function getProducts(
  params: Record<string, string> = {},
): Promise<Product[] | null> {
  try {
    return (await get<Product[]>("/products", params)) ?? [];
  } catch {
    return null;
  }
}

export async function getCategories<T>(): Promise<T | null> {
  try {
    return await get<T>("/products/categories");
  } catch {
    return null;
  }
}
