import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 py-20 text-center text-ink-text">
      <p className="text-xs uppercase tracking-[0.3em] text-ink-text/70">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-0.04em] md:text-6xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-[15px] text-ink-text/70">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn-ink">
          Browse posters
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink-text"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
