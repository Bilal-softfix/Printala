"use client";

import { HiOutlineDownload, HiOutlineClipboardCopy } from "react-icons/hi";
import toast from "react-hot-toast";
import type { Subscriber } from "@/types/admin";
import { getSubscribers } from "@/lib/adminApi";
import { Card, EmptyState, ErrorState, LoadingBlock, PageHeader, Tag, btnGhost, fmtDate, useAdminData } from "../ui";

export default function AdminSubscribersPage() {
  const { state, data, reload: load } = useAdminData<Subscriber[]>("subscribers", () =>
    getSubscribers().then((r) => r.data || []),
  );
  const subscribers = data ?? [];

  const active = subscribers.filter((s) => s.active);

  const exportCsv = () => {
    const rows = [["email", "status", "subscribed_on"], ...subscribers.map((s) => [s.email, s.active ? "active" : "inactive", s.createdAt])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `printala-subscribers-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmails = () =>
    navigator.clipboard
      .writeText(active.map((s) => s.email).join(", "))
      .then(() => toast.success(`${active.length} emails copied`));

  return (
    <div>
      <PageHeader
        title="Subscribers"
        subtitle={state === "ok" ? `${active.length} active · ${subscribers.length} total` : undefined}
        actions={
          subscribers.length > 0 && (
            <>
              <button type="button" onClick={copyEmails} className={btnGhost}>
                <HiOutlineClipboardCopy size={16} aria-hidden="true" /> Copy active emails
              </button>
              <button type="button" onClick={exportCsv} className={btnGhost}>
                <HiOutlineDownload size={16} aria-hidden="true" /> Export CSV
              </button>
            </>
          )
        }
      />

      <Card className="overflow-hidden">
        {state === "loading" ? (
          <LoadingBlock />
        ) : state === "error" ? (
          <ErrorState onRetry={load} message="Couldn't load subscribers." />
        ) : subscribers.length === 0 ? (
          <EmptyState title="No subscribers yet" hint="Newsletter sign-ups from the footer appear here." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-white/45">
                <th scope="col" className="px-5 py-3 font-semibold">Email</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {subscribers.map((s) => (
                <tr key={s._id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3 font-medium">{s.email}</td>
                  <td className="px-5 py-3">{s.active ? <Tag tone="green">Active</Tag> : <Tag>Unsubscribed</Tag>}</td>
                  <td className="px-5 py-3 text-white/55">{fmtDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
