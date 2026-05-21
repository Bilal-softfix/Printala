import { Metadata } from "next";
import AnimateIn from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "Printala — premium posters and split wall art for anime fans, gamers, car enthusiasts, cricket lovers & more.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "500+", label: "Designs" },
  { value: "50K+", label: "Posters Sold" },
  { value: "4.9★", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="container-main">
        <AnimateIn className="max-w-3xl mb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
            Our Story
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-8">
            Built by Poster Lovers,
            <br />
            <span className="text-text-muted">For Poster Lovers</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            We started Printala because we were tired of two things: overpriced
            wall art that looks like it belongs in a dentist&apos;s office, and
            cheap posters that fall apart in a week.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed mb-6">
            Whether you&apos;re repping your favorite anime, decking out your
            gaming setup with legendary characters, putting a supercar on your
            wall, or celebrating cricket&apos;s greatest moments — we&apos;ve
            got you covered with posters that actually look and feel premium.
          </p>
          <p className="text-text-secondary text-lg leading-relaxed">
            Every poster is printed on thick 300gsm matte paper, shipped in
            rigid tubes (zero creases, ever), and priced so you can actually
            afford to cover your whole wall. Oh, and our split posters?
            They&apos;re basically a cheat code for making any room look insane.
          </p>
        </AnimateIn>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden mb-24">
          {STATS.map((stat, i) => (
            <AnimateIn
              key={stat.label}
              delay={i * 0.1}
              className="bg-bg-secondary p-10 text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-gradient">
                {stat.value}
              </p>
              <p className="text-text-muted text-sm uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </AnimateIn>
          ))}
        </div>

        {/* What we do */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "Curated for YOU",
              description:
                "No random stock photos. Every design is hand-picked based on what fans actually want — anime, gaming, cars, sports, movies, and more.",
            },
            {
              icon: "💎",
              title: "Premium Quality",
              description:
                "300gsm thick matte paper. Vivid UV-resistant inks. Rigid tube packaging. We obsess over quality so your poster looks amazing for years.",
            },
            {
              icon: "🔥",
              title: "Split Posters",
              description:
                "Our signature multi-panel sets (3 or 5 panels) transform any wall into a jaw-dropping gallery. The most fire thing you can do to a boring wall.",
            },
          ].map((val, i) => (
            <AnimateIn
              key={val.title}
              delay={i * 0.15}
              className="bg-bg-secondary border border-white/5 rounded-2xl p-8"
            >
              <span className="text-4xl">{val.icon}</span>
              <h2 className="font-display text-xl font-bold mb-4 mt-4 line-accent">
                {val.title}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mt-6">
                {val.description}
              </p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </div>
  );
}
