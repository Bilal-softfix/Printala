"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/data";
import { EASE, VIEWPORT } from "@/lib/motion";

/* Section G — product quality as an editorial spec sheet.
   Claims mirror what the store already states elsewhere on the site. */
const SPECS = [
  {
    n: "300",
    unit: "gsm",
    title: "Thick matte art paper",
    text: "Heavyweight stock with a soft matte finish — no glare, no flimsy curl at the corners.",
  },
  {
    n: "UV",
    unit: "inks",
    title: "Colours that stay vivid",
    text: "UV-resistant inks keep blacks deep and colours bright on your wall for years.",
  },
  {
    n: "0",
    unit: "creases",
    title: "Shipped in a hard tube",
    text: "Every poster travels rolled in a rigid cardboard tube — no folds, no dents, no surprises.",
  },
  {
    n: "3–5",
    unit: "days",
    title: "Delivered across India",
    text: "Quick processing and shipping to your door, with Cash on Delivery available.",
  },
];

const CLOSE_UP = CATEGORIES.find((c) => c.slug === "cars")?.image ?? CATEGORIES[0].image;

export default function WhyPrintala() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1.05]);

  return (
    <section aria-labelledby="why-heading" className="bg-paper py-24 text-ink-text md:py-32">
      <div className="container-main grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        {/* Close-up of the print — the paper itself is the story */}
        <div ref={ref} className="relative lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-3">
            <motion.div style={{ scale }} className="absolute inset-0">
              <Image
                src={CLOSE_UP}
                alt="Close-up of a Printala matte poster print"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <span className="gallery-grain pointer-events-none absolute inset-0 !opacity-[0.12]" />
          </div>
          <p className="mt-4 flex justify-between text-[10.5px] uppercase tracking-[0.26em] text-ink-text/55">
            <span>Detail — matte surface</span>
            <span>300gsm</span>
          </p>
        </div>

        <div>
          <SectionHeading
            id="why-heading"
            index="04"
            eyebrow="The print"
            lines={["Made to be", "looked at."]}
          />

          <dl className="mt-14 border-t border-black/15">
            {SPECS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                className="group grid grid-cols-[7.5rem_1fr] items-baseline gap-6 border-b border-black/15 py-8 sm:grid-cols-[10rem_1fr] md:gap-10"
              >
                <dt className="font-display font-bold leading-none tracking-[-0.05em]">
                  <span className="text-[clamp(2.75rem,5vw,4.25rem)] transition-colors duration-500 group-hover:text-accent">
                    {s.n}
                  </span>
                  <span className="ml-1.5 align-top text-xs font-medium uppercase tracking-[0.2em] text-ink-text/55">
                    {s.unit}
                  </span>
                </dt>
                <dd>
                  <p className="text-lg font-medium">{s.title}</p>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-text/65">{s.text}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
