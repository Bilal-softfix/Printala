import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem, Size } from "@/types";

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
          const updated = [...items];
          updated[idx].quantity += quantity;
          set({ items: updated, isOpen: true });
        } else {
          set({
            items: [...items, { product, quantity, selectedSize: size }],
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
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (s, i) => s + (i.product.price + i.selectedSize.priceModifier) * i.quantity,
          0
        ),
    }),
    { name: "printala-cart" }
  )
);