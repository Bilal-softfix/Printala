import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// ——— Products ———
export const fetchProducts = (params?: Record<string, string>) =>
  API.get("/products", { params }).then((r) => r.data);

export const fetchProductById = (id: string) =>
  API.get(`/products/${id}`).then((r) => r.data);

export const fetchProductBySlug = (slug: string) =>
  API.get(`/products/slug/${slug}`).then((r) => r.data);

export const fetchFeaturedProducts = () =>
  API.get("/products", { params: { featured: "true" } }).then((r) => r.data);

export const fetchCategories = () =>
  API.get("/products/categories").then((r) => r.data);

export const fetchRelatedProducts = (id: string) =>
  API.get(`/products/${id}/related`).then((r) => r.data);

// ——— Orders ———
export const createOrder = (data: unknown) =>
  API.post("/orders", data).then((r) => r.data);

export const trackOrder = (orderNumber: string) =>
  API.get(`/orders/track/${orderNumber}`).then((r) => r.data);

// ——— Payment ———
// export const createRazorpayOrder = (amount: number, orderId?: string) =>
//   API.post("/payment/create-order", { amount, orderId }).then((r) => r.data);

export const verifyPayment = (data: unknown) =>
  API.post("/payment/verify", data).then((r) => r.data);

// ——— Contact ———
export const sendContactMessage = (data: unknown) =>
  API.post("/contact", data).then((r) => r.data);

// ——— Newsletter ———
export const subscribeNewsletter = (email: string) =>
  API.post("/newsletter", { email }).then((r) => r.data);

export default API;