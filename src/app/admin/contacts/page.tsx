"use client";

import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import type { ContactMessage } from "@/types/admin";
import { getContacts } from "@/lib/adminApi";
import { Card, EmptyState, ErrorState, LoadingBlock, PageHeader, Tag, btnPrimary, fmtDate, useAdminData } from "../ui";

export default function AdminContactsPage() {
  const { state, data, reload: load } = useAdminData<ContactMessage[]>("contacts", () =>
    getContacts().then((r) => r.data || []),
  );
  const contacts = data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = contacts.find((c) => c._id === selectedId) ?? null;
  const unread = contacts.filter((c) => c.status === "new").length;

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle={state === "ok" ? `${contacts.length} total · ${unread} new` : undefined}
      />

      {state === "loading" ? (
        <Card><LoadingBlock /></Card>
      ) : state === "error" ? (
        <Card><ErrorState onRetry={load} message="Couldn't load messages." /></Card>
      ) : contacts.length === 0 ? (
        <Card><EmptyState title="No messages yet" hint="Messages from the contact form appear here." /></Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <Card className="overflow-hidden">
            <ul className="max-h-[70vh] divide-y divide-white/[0.06] overflow-y-auto">
              {contacts.map((c) => (
                <li key={c._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c._id)}
                    aria-current={selectedId === c._id ? "true" : undefined}
                    className={`w-full px-5 py-4 text-left transition-colors ${
                      selectedId === c._id ? "bg-magenta/10" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium">{c.name}</span>
                      <span className="shrink-0 text-xs text-white/40">{fmtDate(c.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {c.status === "new" && <Tag tone="pink">New</Tag>}
                      <span className="truncate text-sm text-white/55">{c.subject || "(no subject)"}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            {selected ? (
              <article>
                <h2 className="text-lg font-semibold">{selected.subject || "(no subject)"}</h2>
                <p className="mt-1 text-sm text-white/55">
                  {selected.name} · {selected.email} · {fmtDate(selected.createdAt)}
                </p>
                <p className="mt-6 whitespace-pre-wrap leading-relaxed text-white/85">{selected.message}</p>
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || "Your message to Printala"}`)}`}
                  className={`${btnPrimary} mt-8`}
                >
                  <HiOutlineMail size={16} aria-hidden="true" /> Reply by email
                </a>
              </article>
            ) : (
              <EmptyState title="Select a message" hint="Choose a message on the left to read it." />
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
