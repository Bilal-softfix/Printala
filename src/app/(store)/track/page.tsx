import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/site";
import TrackForm from "./TrackForm";

export const metadata: Metadata = {
  title: "Track Your Order — Printala Order Status",
  description:
    "Track your Printala poster order. Enter your order number to see its status — placed, confirmed, shipped or delivered.",
  alternates: { canonical: "/track" },
};

const STEPS = [
  ["Placed", "We've received your order."],
  ["Confirmed", "We review and confirm your order."],
  ["Processing", "Your posters are printed and packed in a rigid tube."],
  ["Shipped", "Handed to the courier — tracking number added."],
  ["Delivered", "Pay on delivery (COD) and enjoy your wall."],
];

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main max-w-2xl">
        <SectionHeading as="h1" index="—" eyebrow="Order status" lines={["Track your order."]} />
        <p className="mt-6 text-[15px] text-ink-text/75">
          Enter the order number shown after checkout. Lost it? Call or WhatsApp us at{" "}
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            {SITE.phone}
          </a>{" "}
          with the phone number you ordered with.
        </p>

        <Suspense>
          <TrackForm />
        </Suspense>

        <section aria-labelledby="how-tracking" className="mt-16">
          <h2 id="how-tracking" className="font-display text-2xl font-bold tracking-[-0.03em]">
            How order tracking works
          </h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink-text text-sm font-semibold text-cream">
                  {i + 1}
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="text-sm text-ink-text/70">{text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
