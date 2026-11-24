import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { blogTags, sortedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Poster Guides, Size Help & Room Decor Ideas",
  description:
    "Poster size guides, how to hang split posters, anime room decor ideas and tips for decorating hostel and rented rooms — from the Printala team.",
  alternates: { canonical: "/blog" },
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main">
        <SectionHeading as="h1" index="—" eyebrow="Guides & ideas" lines={["The Printala", "journal."]} />
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
          {blogTags().map((t) => (
            <li key={t.slug}>
              <Link href={`/blog/tag/${t.slug}`} className="chip capitalize">
                {t.name} ({t.count})
              </Link>
            </li>
          ))}
        </ul>
        <ul className="mt-10 grid gap-px border-y border-black/10 bg-black/10 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="bg-paper">
              <Link href={`/blog/${p.slug}`} className="group block h-full p-6 transition-colors hover:bg-paper-2 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-ink-text/70">
                  {fmt(p.date)} · {p.readMinutes} min read
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.02em] group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-text/75">{p.description}</p>
                <span className="mt-5 inline-block text-sm font-medium underline underline-offset-4">Read guide →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
