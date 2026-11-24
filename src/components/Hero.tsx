"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useRef, useSyncExternalStore, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { HiArrowRight, HiArrowUpRight } from "react-icons/hi2";
import { CATEGORIES } from "@/lib/categories";

/* ─────────────────────────────────────────────────────────────
   The composition. Every print is a real catalogue image (each
   category's cover art) and links into that collection.

   Positions are % of the stage box, so the arrangement holds its
   shape at any size. `lg` is the cinematic desktop layout; `sm` is
   a separate vertical arrangement for phones/tablets (prints
   without one are hidden there).
   ───────────────────────────────────────────────────────────── */

type Box = { l: number; t: number; w: number };
type Frame = "frame" | "mat" | "paper";

interface Print {
  slug: string;
  ratio: string; // aspect ratio of the artwork itself
  frame: Frame;
  r: number; // resting rotation, deg
  depth: number; // 0 (far) → 1 (near): drives parallax strength
  z: number;
  float: [duration: number, amplitude: number, delay: number];
  enter: number; // entrance delay, s
  lg: Box;
  sm?: Box;
  lead?: boolean;
}

const PRINTS: Print[] = [
  { slug: "anime", ratio: "9/16", frame: "paper", r: 4, depth: 0.3, z: 1, float: [11, -6, -3], enter: 1.0, lg: { l: 48, t: -3, w: 15 } },
  { slug: "gaming", ratio: "9/16", frame: "paper", r: -6, depth: 0.5, z: 2, float: [9, -9, -1], enter: 0.62, lg: { l: 2, t: 7, w: 28 }, sm: { l: 0, t: 3, w: 33 } },
  { slug: "cars", ratio: "9/16", frame: "mat", r: 5, depth: 0.55, z: 2, float: [10, -8, -5], enter: 0.72, lg: { l: 70, t: 3, w: 28 }, sm: { l: 67, t: 7, w: 33 } },
  { slug: "split-poster", ratio: "16/9", frame: "frame", r: 3, depth: 0.8, z: 3, float: [8, -7, -2], enter: 0.82, lg: { l: 0, t: 65, w: 38 }, sm: { l: 46, t: 74, w: 52 } },
  { slug: "anime-girls", ratio: "9/20", frame: "paper", r: -4, depth: 0.85, z: 4, float: [9.5, -10, -4], enter: 0.92, lg: { l: 79, t: 55, w: 16 } },
  { slug: "bollywood", ratio: "2/3", frame: "frame", r: -2, depth: 1, z: 5, float: [7, -12, 0], enter: 0.45, lg: { l: 30, t: 19, w: 42 }, sm: { l: 23, t: 9, w: 54 }, lead: true },
];

const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]));

/* Desktop-only motion: phones/tablets skip pointer + scroll parallax. */
const DESKTOP = "(min-width: 1024px)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getDesktop = () => window.matchMedia(DESKTOP).matches;

const SPRING = { stiffness: 60, damping: 20, mass: 0.7 };
const vars = (o: Record<string, string | number>) => o as CSSProperties;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useSyncExternalStore(subscribe, getDesktop, () => false);
  const live = desktop && !reduce;

  // Pointer, normalised to -0.5..0.5 and smoothed
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const stageRotY = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const stageRotX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const lightX = useTransform(sx, (v) => v * 70);
  const lightY = useTransform(sy, (v) => v * 50);

  const onMove = (e: React.PointerEvent) => {
    if (!live || e.pointerType !== "mouse") return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-labelledby="hero-title"
      data-nav-theme="dark"
      className="gallery relative isolate overflow-hidden"
    >
      {/* ── Atmosphere ── */}
      <div
        aria-hidden="true"
        className="gallery-atmos pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#080808_0%,#0c0c0c_60%,#101010_100%)]" />
        <motion.div
          style={live ? { x: lightX, y: lightY } : undefined}
          className="absolute -left-[20%] top-[46%] h-[60%] w-[140%] bg-[radial-gradient(closest-side,rgba(225,15,128,0.11),rgba(225,15,128,0.03)_50%,transparent)] lg:left-[36%] lg:top-[4%] lg:h-[92%] lg:w-[72%]"
        />
        <div className="absolute -left-[10%] top-[10%] h-[50%] w-[50%] bg-[radial-gradient(closest-side,rgba(245,242,236,0.035),transparent)]" />
        <div className="gallery-vignette absolute inset-0" />
        <div className="gallery-grain absolute inset-0" />
      </div>

      <div className="container-main relative flex min-h-[100svh] flex-col pt-28 pb-16 sm:pt-32 lg:justify-center lg:py-28">
        {/* ── Copy ── */}
        <motion.div
          style={live ? { y: textY, opacity: textOpacity } : undefined}
          className="relative z-20 lg:max-w-[48%]"
        >
          <h1
            id="hero-title"
            className="gallery-fade-up flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[var(--g-muted)] sm:tracking-[0.32em]"
            style={vars({ "--d": "0.25s" })}
          >
            <span className="hidden h-px w-8 bg-[var(--g-accent)] sm:block" />
            Anime, gaming &amp; split posters in India
          </h1>

          <p
            className="mt-7 font-display text-[clamp(2.2rem,10.2vw,4.75rem)] font-bold uppercase leading-[0.92] tracking-[-0.045em] text-[var(--g-text)] lg:text-[clamp(3rem,5.2vw,6.25rem)]"
          >
            <span className="gallery-line">
              <span className="text-outline" style={vars({ "--d": "0.3s" })}>
                Your
              </span>
            </span>
            <span className="gallery-line">
              <span style={vars({ "--d": "0.4s" })}>Walls.</span>
            </span>
            <span className="gallery-line">
              <span className="text-outline" style={vars({ "--d": "0.5s" })}>
                Your
              </span>
            </span>
            <span className="gallery-line">
              <span style={vars({ "--d": "0.6s" })}>
                Universe<span className="text-[var(--g-accent)]">.</span>
              </span>
            </span>
          </p>

          <p
            className="gallery-fade-up mt-8 max-w-[25rem] text-[15px] leading-relaxed text-[var(--g-muted)] sm:text-base"
            style={vars({ "--d": "0.85s" })}
          >
            <span className="block text-[var(--g-text)]">
              Art that speaks your language.
            </span>
            Premium 300gsm matte posters and split wall art, delivered across
            India.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              href="/shop"
              className="gallery-cta gallery-fade-up inline-flex h-13 items-center gap-4 rounded-full bg-[var(--g-text)] pl-7 pr-2 text-sm font-medium text-[var(--g-bg)] transition-colors duration-500 hover:bg-[var(--g-accent)] hover:text-[var(--g-text)]"
              style={vars({ "--d": "1s" })}
            >
              Shop Posters
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--g-bg)] text-[var(--g-text)]">
                <HiArrowRight aria-hidden="true" className="gallery-cta-arrow" size={15} />
              </span>
            </Link>
            <Link
              href="/#collections"
              className="gallery-cta gallery-fade-up inline-flex items-center gap-2 py-2 text-sm font-medium text-[var(--g-text)]"
              style={vars({ "--d": "1.1s" })}
            >
              <span className="gallery-link-line pb-1">Discover Collections</span>
              <HiArrowUpRight aria-hidden="true" className="gallery-cta-arrow text-[var(--g-accent)]" size={14} />
            </Link>
          </div>

          <CollectionTag className="mt-12 lg:hidden" />
        </motion.div>

        {/* ── The gallery wall ── */}
        <div
          className="relative z-10 mt-16 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:flex lg:w-[54%] lg:items-center lg:justify-center lg:pt-10"
          style={{ perspective: 1600 }}
        >
          <motion.div
            style={
              live
                ? { rotateX: stageRotX, rotateY: stageRotY, scale: stageScale }
                : undefined
            }
            className="relative mx-auto aspect-[1/1.15] w-full max-w-[34rem] lg:aspect-[1/1.05] lg:w-[min(92%,calc((100svh-9rem)/1.05))] lg:max-w-none"
          >
            {PRINTS.map((p) => (
              <PrintSlot
                key={p.slug}
                p={p}
                sx={sx}
                sy={sy}
                progress={scrollYProgress}
                live={live}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Footer rail (desktop) ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden lg:block">
        <div className="container-main relative flex items-end justify-between pb-8">
          <CollectionTag />
          <div
            aria-hidden="true"
            className="gallery-fade absolute left-1/2 bottom-8 flex -translate-x-1/2 flex-col items-center gap-3"
            style={vars({ "--d": "1.6s" })}
          >
            <span className="text-xs uppercase tracking-[0.34em] text-[var(--g-muted)]">
              Scroll
            </span>
            <span className="relative h-10 w-px overflow-hidden bg-[var(--g-line)]">
              <span className="gallery-scroll-dot absolute inset-x-0 top-0 h-1/3 bg-[var(--g-accent)]" />
            </span>
          </div>
          <span className="w-px" />
        </div>
      </div>
    </section>
  );
}

function CollectionTag({ className = "" }: { className?: string }) {
  return (
    <p
      className={`gallery-fade flex items-center gap-2.5 whitespace-nowrap text-xs font-medium uppercase tracking-[0.16em] text-[var(--g-muted)] sm:gap-3 sm:text-xs sm:tracking-[0.28em] ${className}`}
      style={vars({ "--d": "1.4s" })}
    >
      <span className="gallery-pulse h-1.5 w-1.5 rounded-full bg-[var(--g-accent)]" />
      300gsm Matte
      <span className="text-white/25">/</span>
      Delivered Across India
    </p>
  );
}

const FRAME: Record<Frame, { cls: string; pad: string }> = {
  // slim black gallery frame
  frame: { cls: "bg-[#161617] border border-white/[0.07]", pad: "2.4%" },
  // black frame with a museum mat
  mat: { cls: "bg-[#EFEBE3] border-[5px] border-[#121213]", pad: "8%" },
  // unframed print, paper edge showing
  paper: { cls: "bg-[#ECE8E0]", pad: "2.6%" },
};

const PrintSlot = memo(function PrintSlot({
  p,
  sx,
  sy,
  progress,
  live,
}: {
  p: Print;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  progress: MotionValue<number>;
  live: boolean;
}) {
  const cat = CAT[p.slug];

  // Near prints drift further against the cursor and rise faster on scroll.
  const x = useTransform(sx, (v) => -v * 38 * p.depth);
  const y = useTransform<number, number>(
    [sy, progress],
    ([m, s]) => -m * 26 * p.depth - s * 260 * p.depth,
  );

  if (!cat) return null;
  const f = FRAME[p.frame];
  const sm = p.sm;

  return (
    <motion.div
      className={`gallery-slot absolute left-[var(--l)] top-[var(--t)] w-[var(--w)] lg:left-[var(--l-lg)] lg:top-[var(--t-lg)] lg:w-[var(--w-lg)] ${sm ? "" : "hidden lg:block"}`}
      style={{
        ...vars({
          "--l": `${sm?.l ?? 0}%`,
          "--t": `${sm?.t ?? 0}%`,
          "--w": `${sm?.w ?? 0}%`,
          "--l-lg": `${p.lg.l}%`,
          "--t-lg": `${p.lg.t}%`,
          "--w-lg": `${p.lg.w}%`,
        }),
        zIndex: p.z,
        ...(live ? { x, y } : {}),
      }}
    >
      <div
        className="gallery-print-in"
        style={vars({ "--r": `${p.r}deg`, "--d": `${p.enter}s` })}
      >
        <div
          className="gallery-float"
          style={vars({
            "--fd": `${p.float[0]}s`,
            "--fa": `${p.float[1]}px`,
            "--fdl": `${p.float[2]}s`,
          })}
        >
          <motion.div
            whileHover={live ? { scale: 1.045, y: -6 } : undefined}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <Link
              href={`/shop/${cat.slug}`}
              aria-label={`Browse ${cat.name} posters`}
              className="gallery-print-wrap relative block outline-none"
            >
              <div
                className={`gallery-print relative ${f.cls}`}
                style={{ padding: f.pad }}
              >
                <div
                  className="relative overflow-hidden bg-[#1c1c1e]"
                  style={{ aspectRatio: p.ratio }}
                >
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    priority={p.lead}
                    sizes={`(min-width: 1024px) ${Math.round(p.lg.w * 7.4)}px, ${sm?.w ?? 30}vw`}
                    className="object-cover"
                  />
                  {p.frame === "mat" && (
                    <span className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.45)]" />
                  )}
                </div>
                <span className="gallery-sheen pointer-events-none absolute inset-0" />
              </div>

              <span
                aria-hidden="true"
                data-always={p.lead ? "" : undefined}
                className={`gallery-caption pointer-events-none absolute top-full mt-4 hidden flex-col gap-1 whitespace-nowrap text-xs uppercase tracking-[0.24em] lg:flex ${p.lead ? "right-0 items-end" : "left-0"}`}
              >
                <span className="text-[var(--g-text)]">
                  {p.lead && <span className="text-[var(--g-accent)]">N° 01 — </span>}
                  {cat.name}
                </span>
                <span className="text-[var(--g-muted)]">
                  {cat.count} prints{p.lead ? " · 300gsm matte" : ""}
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});
