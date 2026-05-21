"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { adminLogin } from "@/lib/adminApi";
import { useAdminStore } from "@/store/adminStore";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loadFromStorage } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) router.push("/admin");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await adminLogin(email, password);
      login(result.data.admin, result.data.token);
      toast.success("Welcome back! 🎉");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #E10F80, #5FAAC6)" }}
          >
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Printala Admin</h1>
          <p className="text-white/40 text-sm mt-1">
            Login to manage your store
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#1A1A1D] border border-white/10 rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@printala.in"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder-white/30 focus:outline-none focus:border-magenta
                         transition-colors"
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         text-white placeholder-white/30 focus:outline-none focus:border-magenta
                         transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-magenta text-white font-bold rounded-xl
                       hover:bg-magenta-light transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
