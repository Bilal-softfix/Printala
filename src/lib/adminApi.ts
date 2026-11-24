import axios from "axios";

const ADMIN_API = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://printala-api.onrender.com/api",
  timeout: 15000,
});

// Attach token to every request
ADMIN_API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally
ADMIN_API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// ─── Auth ───
export const adminLogin = (email: string, password: string) =>
  ADMIN_API.post("/admin/login", { email, password }).then((r) => r.data);

export const getMe = () => ADMIN_API.get("/admin/me").then((r) => r.data);

export const changePassword = (currentPassword: string, newPassword: string) =>
  ADMIN_API.put("/admin/password", { currentPassword, newPassword }).then(
    (r) => r.data,
  );

// ─── Dashboard ───
export const getDashboard = () =>
  ADMIN_API.get("/admin/dashboard").then((r) => r.data);

// ─── Products ───
export const getAdminProducts = (params?: Record<string, string>) =>
  ADMIN_API.get("/admin/products", { params }).then((r) => r.data);

export const createProduct = (data: FormData | object) =>
  ADMIN_API.post("/admin/products", data).then((r) => r.data);

export const updateProduct = (id: string, data: FormData | object) =>
  ADMIN_API.put(`/admin/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  ADMIN_API.delete(`/admin/products/${id}`).then((r) => r.data);

// ─── Orders ───
export const getAdminOrders = (params?: Record<string, string>) =>
  ADMIN_API.get("/admin/orders", { params }).then((r) => r.data);

export const getOrderDetails = (orderNumber: string) =>
  ADMIN_API.get(`/admin/orders/${orderNumber}`).then((r) => r.data);

export const updateOrderStatus = (
  id: string,
  data: { orderStatus: string; trackingNumber?: string },
) => ADMIN_API.put(`/admin/orders/${id}/status`, data).then((r) => r.data);

// ─── Contacts ───
export const getContacts = () =>
  ADMIN_API.get("/admin/contacts").then((r) => r.data);

// ─── Newsletter ───
export const getSubscribers = () =>
  ADMIN_API.get("/admin/newsletter").then((r) => r.data);

// ─── Image Upload ───
export const uploadImage = (file: File, onProgress?: (percent: number) => void) => {
  const formData = new FormData();
  formData.append("image", file);

  return ADMIN_API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) =>
      onProgress?.(Math.round((e.loaded * 100) / (e.total || file.size || 1))),
  }).then((r) => r.data);
};

export const uploadMultipleImages = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return ADMIN_API.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

export const deleteUploadedImage = (fileName: string) =>
  ADMIN_API.delete(`/upload/${fileName}`).then((r) => r.data);

export default ADMIN_API;
