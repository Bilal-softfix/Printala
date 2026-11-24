"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { sendContactMessage } from "@/lib/api";
import { SITE } from "@/lib/site";

const INFO = [
  { label: "Call", value: SITE.phone, href: SITE.phoneHref },
  { label: "WhatsApp", value: "Chat with us", href: SITE.whatsappHref },
  { label: "Hours", value: SITE.hours },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await sendContactMessage(form);
      toast.success(result.message || "Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const msg = getErrorMessage(err, "Couldn't send your message. Please try again.");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div>
          <SectionHeading as="h1" index="—" eyebrow="Get in touch" lines={["Let's", "talk."]} />
          <AnimateIn delay={0.15}>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-text/70">
              Questions about an order? Want to collaborate? Just want to say hi?
              We&apos;d love to hear from you.
            </p>
            <dl className="mt-12 border-t border-black/10">
              {INFO.map((item) => (
                <div key={item.label} className="flex items-baseline justify-between gap-6 border-b border-black/10 py-5">
                  <dt className="text-xs uppercase tracking-[0.26em] text-ink-text/70">{item.label}</dt>
                  <dd className="text-right">
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(item.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                        className="transition-colors hover:text-accent"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </AnimateIn>
        </div>

        <AnimateIn delay={0.2}>
          <form onSubmit={handleSubmit} className="space-y-8 bg-paper-2 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="field-label">Name</label>
                <input id="name" value={form.name} onChange={set("name")} required autoComplete="name" className="field" />
              </div>
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input id="email" type="email" value={form.email} onChange={set("email")} required autoComplete="email" className="field" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="field-label">Subject</label>
              <input id="subject" value={form.subject} onChange={set("subject")} required className="field" />
            </div>
            <div>
              <label htmlFor="message" className="field-label">Message</label>
              <textarea id="message" value={form.message} onChange={set("message")} required rows={6} className="field resize-none" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-ink w-full">
              {loading ? "Sending…" : "Send message"}
            </motion.button>
          </form>
        </AnimateIn>
      </div>
    </div>
  );
}
