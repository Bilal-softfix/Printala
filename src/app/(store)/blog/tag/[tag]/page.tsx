import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogTags, sortedPosts, tagSlug } from "@/lib/blog";
import { BASE_URL, generateBreadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => blogTags().map((t) => ({ tag: t.slug }));

/* Hand-written intros for important hubs; others get a generic line. */
const HUBS: Record<string, { title: string; h1: string; intro: string }> = {
  "south-india": {
    title: "Posters & Room Decor for South India — Tamil, Telugu, Kannada, Malayalam",
    h1: "South India decor guides",
    intro:
      "Guides for fans and homes across Tamil Nadu, Andhra Pradesh, Telangana, Karnataka and Kerala — Kollywood, Tollywood, Sandalwood and Mollywood poster ideas, CSK, RCB and SRH fan walls, room makeovers for Bengaluru, Chennai, Hyderabad and Kochi, and tips for keeping posters fresh in humid coastal cities.",
  },
  "movie-posters": {
    title: "Movie Poster Decor Ideas & Guides",
    h1: "Movie poster guides",
    intro: "Ideas for styling cinema posters — from South Indian blockbusters to Bollywood classics.",
  },
  "room-decor": {
    title: "Room Decor Ideas with Posters",
    h1: "Room decor ideas",
    intro: "Practical ideas to decorate bedrooms, hostels, PGs, flats and gaming rooms with posters.",
  },
};

const find = (slug: string) => blogTags().find((t) => t.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const t = find(tag);
  if (!t) return {};
  const hub = HUBS[tag];
  return {
    title: hub?.title ?? `${t.name.replace(/\b\w/g, (c) => c.toUpperCase())} — Guides & Ideas`,
    description: (hub?.intro ?? `Printala guides about ${t.name}.`).slice(0, 155),
    alternates: { canonical: `/blog/tag/${tag}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const t = find(tag);
  if (!t) notFound();
  const hub = HUBS[tag];
  const posts = sortedPosts().filter((p) => p.tags.some((x) => tagSlug(x) === tag));
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: t.name, url: `/blog/tag/${tag}` },
  ];

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: hub?.h1 ?? t.name,
            url: `${BASE_URL}/blog/tag/${tag}`,
            hasPart: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${BASE_URL}/blog/${p.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(crumbs, BASE_URL)) }}
      />
      <div className="container-main">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-ink-text/70">
          <Link href="/" className="hover:text-ink-text">Home</Link> /{" "}
          <Link href="/blog" className="hover:text-ink-text">Blog</Link>
        </nav>
        <SectionHeading
          as="h1"
          index="—"
          eyebrow={`${posts.length} guides`}
          lines={[`${hub?.h1 ?? t.name.replace(/\b\w/g, (c) => c.toUpperCase())}.`]}
        />
        {hub && <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-text/75">{hub.intro}</p>}

        <ul className="mt-12 grid gap-px border-y border-black/10 bg-black/10 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="bg-paper">
              <Link href={`/blog/${p.slug}`} className="group block h-full p-6 transition-colors hover:bg-paper-2 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-text/70">{p.readMinutes} min read</p>
                <h2 className="mt-3 font-display text-xl font-bold leading-tight group-hover:text-accent md:text-2xl">
                  {p.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-text/75">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
