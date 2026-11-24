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
