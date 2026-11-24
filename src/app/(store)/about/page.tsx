import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "About",
  description:
    "Printala — premium posters and split wall art for anime fans, gamers, car enthusiasts, cricket lovers & more.",
  alternates: { canonical: "/about" },
};

const STATS = [
  { value: "2024", label: "Founded" },
  { value: "500+", label: "Designs" },
  { value: "50K+", label: "Posters sold" },
  { value: "4.9★", label: "Average rating" },
];

const VALUES = [
  {
    title: "Curated for you",
    description:
      "No random stock photos. Every design is hand-picked based on what fans actually want — anime, gaming, cars, sports, movies, and more.",
  },
  {
    title: "Premium quality",
    description:
      "300gsm thick matte paper. Vivid UV-resistant inks. Rigid tube packaging. We obsess over quality so your poster looks amazing for years.",
  },
  {
    title: "Split posters",
    description:
      "Our signature multi-panel sets (3 or 5 panels) transform any wall into a gallery. The boldest thing you can do to a boring wall.",
  },
];

const PORTRAIT = CATEGORIES.find((c) => c.slug === "bollywood")?.image ?? CATEGORIES[0].image;

export default function AboutPage() {
  return (
    <div className="bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main">
        <SectionHeading
          as="h1"
          index="—"
          eyebrow="Our story"
          lines={["Built by poster", "lovers."]}
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <AnimateIn>
            <div className="bg-paper-2 px-[14%] py-[12%]">
              <div className="relative aspect-[2/3] shadow-[0_2px_4px_rgba(0,0,0,0.12),0_30px_60px_-18px_rgba(0,0,0,0.45)]">
                <Image
                  src={PORTRAIT}
                  alt="A Printala poster print"
                  fill
                  sizes="(min-width: 1024px) 35vw, 80vw"
                  className="object-cover"
                />
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1} className="space-y-6 text-[17px] leading-relaxed text-ink-text/75 lg:pt-6">
            <p className="font-display text-2xl font-bold leading-snug tracking-[-0.02em] text-ink-text md:text-3xl">
              We started Printala because we were tired of two things: overpriced
              wall art that belongs in a dentist&apos;s office, and cheap posters
              that fall apart in a week.
            </p>
            <p>
              Whether you&apos;re repping your favourite anime, decking out your
              gaming setup, putting a supercar on your wall, or celebrating
              cricket&apos;s greatest moments — we make posters that actually
              look and feel premium.
            </p>
            <p>
              Every poster is printed on thick 300gsm matte paper, shipped in
              rigid tubes (zero creases, ever), and priced so you can afford to
              cover your whole wall. And our split posters? A cheat code for
              making any room look incredible.
            </p>
          </AnimateIn>
        </div>

        {/* Numbers */}
        <dl className="mt-24 grid grid-cols-2 border-y border-black/10 md:mt-32 md:grid-cols-4">
          {STATS.map((s, i) => (
            <AnimateIn
              key={s.label}
              delay={i * 0.08}
              className={`py-10 ${i % 2 ? "border-l border-black/10 pl-6" : ""} ${i === 2 ? "md:border-l md:pl-6" : ""} ${i > 1 ? "border-t border-black/10 md:border-t-0" : ""}`}
            >
              <dt className="text-[10.5px] uppercase tracking-[0.26em] text-ink-text/55">{s.label}</dt>
              <dd className="mt-3 font-display text-5xl font-bold tracking-[-0.05em] md:text-6xl">{s.value}</dd>
            </AnimateIn>
          ))}
        </dl>

        {/* What we stand for */}
        <div className="mt-24 md:mt-32">
          <SectionHeading index="—" eyebrow="What we stand for" size="sm" lines={["Three promises."]} />
          <ol className="mt-12 border-t border-black/10">
            {VALUES.map((v, i) => (
              <li key={v.title} className="border-b border-black/10">
                <AnimateIn delay={i * 0.08} className="grid gap-4 py-10 md:grid-cols-[6rem_1fr_1.4fr] md:gap-10">
                  <span className="text-sm text-accent">0{i + 1}</span>
                  <h2 className="font-display text-2xl font-bold uppercase tracking-[-0.03em] md:text-3xl">{v.title}</h2>
                  <p className="max-w-xl text-[15px] leading-relaxed text-ink-text/70">{v.description}</p>
                </AnimateIn>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 flex flex-wrap items-center gap-6">
          <Link href="/shop" className="btn-ink">Explore the collection</Link>
          <Link href="/contact" className="border-b border-black/25 pb-1 text-sm transition-colors hover:border-accent">
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
