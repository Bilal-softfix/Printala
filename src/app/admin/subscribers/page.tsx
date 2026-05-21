"use client";

import { useEffect, useState } from "react";
import { getSubscribers } from "@/lib/adminApi";
import { HiOutlineMail } from "react-icons/hi";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getSubscribers();
        setSubscribers(result.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-bold">
            Newsletter Subscribers
          </h1>
          <p className="text-white/40 text-sm">
            {activeCount} active / {subscribers.length} total
          </p>
        </div>
      </div>

      <div className="bg-[#1A1A1D] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-3 border-magenta/30 border-t-magenta rounded-full animate-spin mx-auto" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-12 text-center text-white/30">
            No subscribers yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/5">
                  <th className="text-left px-6 py-4">#</th>
                  <th className="text-left px-6 py-4">Email</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Subscribed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map((sub, i) => (
                  <tr key={sub._id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-white/30">{i + 1}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2 text-white">
                        <HiOutlineMail size={14} className="text-magenta" />
                        {sub.email}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {sub.active ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white/40">
                      {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
