"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimateIn from "@/components/AnimateIn";
import { sendContactMessage } from "@/lib/api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await sendContactMessage(form);
      toast.success(result.message || "Message bhej diya! 💌");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Message nahi gaya. Try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          {/* Left */}
          <AnimateIn>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
              Get in Touch
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Let&apos;s
              <br />
              <span className="text-text-muted">Talk</span>
            </h1>
            <p className="text-text-secondary leading-relaxed mb-10 max-w-md">
              Questions about an order? Want to collaborate? Just want to say
              hi? We&apos;d love to hear from you.
            </p>

            <div className="space-y-6">
              {[
                { label: "Email", value: "hello@printala.com" },
                { label: "Response Time", value: "Within 24 hours" },
                { label: "Hours", value: "Mon – Fri, 9am – 6pm EST" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-wider text-text-muted font-bold">
                    {item.label}
                  </p>
                  <p className="text-lg mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </AnimateIn>

          {/* Form */}
          <AnimateIn delay={0.2}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="input-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-2"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  required
                  className="input-dark"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                  rows={6}
                  className="input-dark resize-none"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </motion.button>
            </form>
          </AnimateIn>
        </div>
      </div>
    </div>
  );
}
