import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Block, POSTS, getPost, sortedPosts } from "@/lib/blog";
import { BASE_URL, generateBreadcrumbJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      ...(post.cover && { images: [post.cover] }),
    },
  };
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

function Render({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2 className="mt-12 font-display text-2xl font-bold tracking-[-0.02em] md:text-3xl">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-8 text-lg font-semibold">{block.text}</h3>;
    case "list":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-accent">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink-text">
                {block.head.map((h) => (
                  <th key={h} scope="col" className="py-3 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r[0]} className="border-b border-black/10">
                  {r.map((c, i) => (
                    <td key={i} className={`py-3 pr-4 ${i === 0 ? "font-semibold" : "text-ink-text/80"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "cta":
      return (
        <p className="mt-10">
          <Link href={block.href} className="btn-ink">
            {block.text} →
          </Link>
        </p>
      );
    default:
      return <p className="mt-4">{block.text}</p>;
  }
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const url = `${BASE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    mainEntityOfPage: url,
    url,
    keywords: post.tags.join(", "),
    author: { "@type": "Organization", name: "Printala", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "Printala",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    ...(post.cover && { image: post.cover }),
  };
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];
  const more = sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbJsonLd(crumbs, BASE_URL)) }}
      />
      <div className="container-main max-w-3xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-ink-text/70">
          <Link href="/" className="hover:text-ink-text">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-ink-text">
            Blog
          </Link>
        </nav>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-text/70">
          {fmt(post.date)} · {post.readMinutes} min read
        </p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
          {post.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-text/75">{post.description}</p>

        <div className="mt-10 border-t border-black/10 pt-2 text-[16px] leading-[1.75] text-ink-text/85">
          {post.body.map((b, i) => (
            <Render key={i} block={b} />
          ))}
        </div>

        {more.length > 0 && (
          <aside aria-labelledby="more-guides" className="mt-20 border-t border-black/10 pt-10">
            <h2 id="more-guides" className="text-xs uppercase tracking-[0.26em] text-ink-text/70">
              More guides
            </h2>
            <ul className="mt-5 space-y-4">
              {more.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="font-display text-xl font-bold hover:text-accent">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </article>
  );
}
