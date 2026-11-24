/* Order numbers remembered on this device so customers never lose them. */
const KEY = "printala-orders";

export type SavedOrder = { orderNumber: string; total?: number; placedAt: string };

export function getSavedOrders(): SavedOrder[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: SavedOrder) {
  try {
    const list = getSavedOrders().filter((o) => o.orderNumber !== order.orderNumber);
    localStorage.setItem(KEY, JSON.stringify([order, ...list].slice(0, 10)));
  } catch {}
}

export const trackUrl = (orderNumber: string) => `/track?order=${encodeURIComponent(orderNumber)}`;
