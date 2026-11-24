import { Faq, faqJsonLd } from "@/lib/faq";

/** Server-rendered FAQ (native <details>, no JS) + FAQPage structured data. */
export default function FaqSection({
  faqs,
  title = "Frequently asked questions",
  className = "",
}: {
  faqs: Faq[];
  title?: string;
  className?: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />
      <h2 id="faq-heading" className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
        {title}
      </h2>
      <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="text-xl text-ink-text/60 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-text/75">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
