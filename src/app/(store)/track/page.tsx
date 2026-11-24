import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import TrackForm from "./TrackForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Check the status of your Printala order with your order number.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main max-w-2xl">
        <SectionHeading as="h1" index="—" eyebrow="Order status" lines={["Track your order."]} />
        <p className="mt-6 text-[15px] text-ink-text/75">
          Enter the order number shown after checkout.
        </p>
        <TrackForm />
      </div>
    </div>
  );
}
