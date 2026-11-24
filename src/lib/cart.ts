/* Shipping rule shared by product page, cart drawer, cart page and checkout. */
export const FREE_SHIPPING_MIN = 499;
export const SHIPPING_FEE = 59;

export function cartTotals(subtotal: number) {
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  return { subtotal, shipping, total: subtotal + shipping };
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const rupees = (n: number) => INR.format(n);
