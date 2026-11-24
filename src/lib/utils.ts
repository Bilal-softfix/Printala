export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}
/** Extracts the API's error message from an axios error, else returns fallback. */
export function getErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || fallback
  );
}

/** Real catalog products have MongoDB ObjectIds; static fallback items don't
 *  (e.g. "anime-1") and can't be ordered. */
export const isOrderableId = (id: string) => /^[a-f0-9]{24}$/i.test(id);
