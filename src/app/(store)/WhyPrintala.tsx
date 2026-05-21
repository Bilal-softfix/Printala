import AnimateIn from "@/components/AnimateIn";

const FEATURES = [
  {
    icon: "🖨️",
    title: "300gsm Paper",
    description:
      "Thick matte art paper. Feels premium, looks premium, IS premium.",
    color: "bg-magenta",
  },
  {
    icon: "🎨",
    title: "Vivid Colors",
    description:
      "UV-resistant inks that pop off the wall. Your posters stay vibrant for years.",
    color: "bg-sky",
  },
  {
    icon: "📦",
    title: "Tube Shipping",
    description:
      "Every poster in a hard cardboard tube. Zero creases. Zero folds. Perfect condition.",
    color: "bg-yellow",
  },
  {
    icon: "⚡",
    title: "3-5 Day Delivery",
    description:
      "Fast processing + quick shipping. Free shipping on orders over $50.",
    color: "bg-magenta",
  },
];

export default function WhyPrintala() {
  return (
    <section
      className="py-24 bg-bg-primary halftone"
      aria-labelledby="why-heading"
    >
      <div className="container-main">
        <AnimateIn className="text-center mb-14">
          <div className="speech-bubble text-sm text-charcoal mb-6 inline-block">
            💎 The Printala Difference
          </div>
          <h2
            id="why-heading"
            className="font-display text-4xl md:text-6xl font-bold text-charcoal"
          >
            Not Your Average{" "}
            <span
              className="font-comic text-gradient"
              style={{ fontSize: "110%" }}
            >
              Poster Shop
            </span>
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <AnimateIn key={f.title} delay={i * 0.1}>
              <div className="comic-card p-6 md:p-8 group text-center h-full">
                <div
                  className={`w-16 h-16 rounded-2xl border-3 border-charcoal shadow-[3px_3px_0_#2F3542]
                                ${f.color} flex items-center justify-center text-3xl mx-auto mb-5
                                group-hover:rotate-6 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-charcoal mb-2">
                  {f.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
