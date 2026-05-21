"use client";

import { useState } from "react";
import { changePassword } from "@/lib/adminApi";
import { useAdminStore } from "@/store/adminStore";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { user } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPass !== passwords.confirm) {
      return toast.error("New passwords don't match!");
    }

    if (passwords.newPass.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const result = await changePassword(passwords.current, passwords.newPass);
      // Update token
      if (result.data?.token) {
        localStorage.setItem("admin_token", result.data.token);
      }
      toast.success("Password changed! 🔐");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-white text-2xl font-bold mb-8">Settings</h1>

      {/* Profile */}
      <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-bold mb-4">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-magenta/20 flex items-center justify-center">
            <span className="text-magenta text-xl font-bold">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-white font-bold">{user?.name}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <p className="text-magenta text-xs uppercase tracking-wider mt-0.5">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-white/50 text-xs font-bold uppercase mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                         focus:outline-none focus:border-magenta transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-bold uppercase mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                         focus:outline-none focus:border-magenta transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-bold uppercase mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                         focus:outline-none focus:border-magenta transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-magenta text-white font-bold rounded-xl
                       hover:bg-magenta-light transition-colors disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
