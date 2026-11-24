"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "@/lib/adminApi";
import { getErrorMessage } from "@/lib/utils";
import { useAdminStore } from "@/store/adminStore";
import { Card, Field, PageHeader, btnPrimary, inputCls } from "../ui";

export default function AdminSettingsPage() {
  const { user } = useAdminStore();
  const [loading, setLoading] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast.error("New passwords don't match.");
    if (pw.next.length < 8) return toast.error("Use at least 8 characters.");
    if (pw.next === pw.current) return toast.error("New password must be different.");

    setLoading(true);
    try {
      const result = await changePassword(pw.current, pw.next);
      if (result.data?.token) localStorage.setItem("admin_token", result.data.token);
      toast.success("Password changed");
      setPw({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't change password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />

      <Card className="mb-6 p-5 sm:p-6">
        <h2 className="mb-4 font-semibold">Account</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-white/45">Name</dt>
            <dd className="mt-1 font-medium">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-white/45">Email</dt>
            <dd className="mt-1 font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-white/45">Role</dt>
            <dd className="mt-1 font-medium capitalize">{user?.role}</dd>
          </div>
        </dl>
      </Card>

      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-semibold">Change password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hidden username helps password managers save the right account. */}
          <input type="email" autoComplete="username" value={user?.email ?? ""} readOnly hidden />
          <Field id="current" label="Current password">
            <input
              id="current"
              type="password"
              required
              autoComplete="current-password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field id="next" label="New password" hint="At least 8 characters">
            <input
              id="next"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field id="confirm" label="Confirm new password">
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              className={inputCls}
            />
          </Field>
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </Card>
    </div>
  );
}
