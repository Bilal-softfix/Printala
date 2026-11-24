"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminLogin } from "@/lib/adminApi";
import { getErrorMessage } from "@/lib/utils";
import { useAdminStore } from "@/store/adminStore";
import logo from "../../assets/logo.png";
import { Field, btnPrimary, inputCls } from "../ui";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const { login, isAuthenticated, loadFromStorage } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Render's free tier sleeps; tell the user why the first login is slow.
    const timer = setTimeout(() => setSlow(true), 4000);
    try {
      const result = await adminLogin(email.trim(), password);
      login(result.data.admin, result.data.token);
      toast.success("Welcome back!");
      router.replace("/admin");
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed. Check your email and password."));
    } finally {
      clearTimeout(timer);
      setSlow(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10] p-4 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Image src={logo} alt="" width={56} height={56} className="mx-auto mb-4 h-14 w-14 object-contain" priority />
          <h1 className="text-2xl font-bold">Printala Admin</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/[0.08] bg-[#151518] p-6 sm:p-8"
        >
          <Field id="email" label="Email">
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field id="password" label="Password">
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-pressed={showPw}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-white/55 hover:text-white"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          {slow && (
            <p role="status" className="text-center text-xs text-white/50">
              Server is waking up — this can take up to a minute.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
