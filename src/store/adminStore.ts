import { create } from "zustand";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminStore {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
      }
    }
  },
}));