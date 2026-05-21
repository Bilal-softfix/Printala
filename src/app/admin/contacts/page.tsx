"use client";

import { useEffect, useState } from "react";
import { getContacts } from "@/lib/adminApi";
import { HiOutlineMail, HiOutlineClock } from "react-icons/hi";

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getContacts();
        setContacts(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-white text-2xl font-bold mb-8">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-magenta/30 border-t-magenta rounded-full animate-spin mx-auto" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center text-white/30 bg-[#1A1A1D] rounded-2xl border border-white/5">
              No messages yet
            </div>
          ) : (
            contacts.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                  selected?._id === c._id
                    ? "bg-magenta/10 border-magenta/20"
                    : "bg-[#1A1A1D] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white font-medium text-sm truncate">
                    {c.name}
                  </p>
                  {c.status === "new" && (
                    <span className="w-2 h-2 rounded-full bg-magenta shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-white/40 text-xs truncate">{c.subject}</p>
                <p className="text-white/20 text-[10px] mt-1 flex items-center gap-1">
                  <HiOutlineClock size={10} />
                  {new Date(c.createdAt).toLocaleDateString("en-IN")}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white text-xl font-bold">
                    {selected.subject}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    From: <span className="text-white">{selected.name}</span>{" "}
                    &lt;{selected.email}&gt;
                  </p>
                </div>
                <p className="text-white/20 text-xs">
                  {new Date(selected.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-5">
                <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="flex items-center gap-2 px-4 py-2 bg-magenta text-white rounded-xl text-sm font-bold
                             hover:bg-magenta-light transition-colors"
                >
                  <HiOutlineMail size={16} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl p-12 text-center text-white/30">
              Select a message to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
