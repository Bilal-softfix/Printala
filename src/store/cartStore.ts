import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem, Size } from "@/types";
import { fetchProductById } from "@/lib/api";

export const MAX_QTY = 10;
const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, n));

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, size: Size, quantity?: number) => void;
  removeItem: (productId: string, sizeLabel: string) => void;
  updateQuantity: (productId: string, sizeLabel: string, quantity: number) => void;
  clearCart: () => void;
  /** Re-syncs price/stock with the API. Returns names of items removed. */
  refreshItems: () => Promise<string[]>;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, size, quantity = 1) => {
        const items = get().items;
        const idx = items.findIndex(
          (i) => i.product._id === product._id && i.selectedSize.label === size.label
        );
        if (idx > -1) {
          const updated = items.map((it, i) =>
            i === idx ? { ...it, quantity: clampQty(it.quantity + quantity) } : it
          );
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { product, quantity: clampQty(quantity), selectedSize: size }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId, sizeLabel) =>
        set({
          items: get().items.filter(
            (i) => !(i.product._id === productId && i.selectedSize.label === sizeLabel)
          ),
        }),

      updateQuantity: (productId, sizeLabel, quantity) =>
        set({
          items: get().items.map((i) =>
            i.product._id === productId && i.selectedSize.label === sizeLabel
              ? { ...i, quantity: clampQty(quantity) }
              : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      refreshItems: async () => {
        const ids = [...new Set(get().items.map((i) => i.product._id))];
        if (!ids.length) return [];
        const results = await Promise.allSettled(ids.map((id) => fetchProductById(id)));
        // undefined = couldn't check (keep item), null = gone (remove item)
        const fresh = new Map<string, Product | null>();
        results.forEach((r, i) => {
          if (r.status === "fulfilled" && r.value?.data) fresh.set(ids[i], r.value.data);
          else if (
            r.status === "rejected" &&
            (r.reason as { response?: { status?: number } })?.response?.status === 404
          )
            fresh.set(ids[i], null);
        });

        const removed: string[] = [];
        const items = get().items.flatMap((it) => {
          if (!fresh.has(it.product._id)) return [it];
          const p = fresh.get(it.product._id);
          const size = p?.sizes.find((s) => s.label === it.selectedSize.label);
          if (!p || !p.inStock || !size) {
            removed.push(it.product.name);
            return [];
          }
          return [{ ...it, product: p, selectedSize: size }];
        });
        set({ items });
        return removed;
      },

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (s, i) => s + (i.product.price + i.selectedSize.priceModifier) * i.quantity,
          0
        ),
    }),
    {
      name: "printala-cart",
      // Persist only the cart contents, never UI state (sidebar would reopen on reload)
      partialize: (s) => ({ items: s.items }),
    }
  )
);