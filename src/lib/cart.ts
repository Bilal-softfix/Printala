/* Shipping rule shared by the cart drawer, cart page and checkout.
   Values unchanged from the original implementation — review them:
   the product page advertises free shipping on ₹499+. */
export const FREE_SHIPPING_MIN = 50;
export const SHIPPING_FEE = 5.99;

export function cartTotals(subtotal: number) {
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

export const rupees = (n: number) => `₹${n.toFixed(2)}`;
