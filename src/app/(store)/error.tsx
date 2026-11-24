"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 pt-28 pb-20 text-center text-ink-text">
      <h1 className="font-display text-4xl font-bold uppercase tracking-[-0.04em] md:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-[15px] text-ink-text/70">
        Please try again. If it keeps happening, contact us.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-ink">
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-black/15 px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink-text"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
