import Image from "next/image";

/** Overall set aspect ratio (width / height) per panel count. */
const RATIO: Record<number, number> = { 2: 1.5, 3: 1.8, 4: 2, 5: 2.2 };
const GAP = 1.8; // gap between panels, % of the set's width

/**
 * Renders ONE image sliced across N panels, like a real split-poster set.
 * Every panel shows only its own window of a single continuous image; the
 * gaps hide the strip of artwork between panels exactly as they would on a wall.
 *
 * Hover fan-out is driven by `.split-panel` + `--o` in globals.css and needs a
 * `.group` ancestor.
 */
export default function SplitPosterPreview({
  src,
  alt,
  panels,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  panels?: number | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const n = Math.min(Math.max(Math.round(panels || 3), 2), 8);
  const w = (100 - GAP * (n - 1)) / n; // panel width, % of the set
  const mid = (n - 1) / 2;

  return (
    <div
      role="img"
      aria-label={`${alt} — ${n} panel split poster`}
      className={`relative w-full [perspective:1100px] ${className}`}
      style={{ aspectRatio: String(RATIO[n] ?? n * 0.45) }}
    >
      {Array.from({ length: n }, (_, i) => {
        const left = i * (w + GAP);
        return (
          <div
            key={i}
            className="split-panel absolute top-0 h-full overflow-hidden bg-ink-3 shadow-[0_2px_4px_rgba(0,0,0,0.15),0_18px_36px_-14px_rgba(0,0,0,0.45)]"
            style={
              {
                left: `${left}%`,
                width: `${w}%`,
                "--o": i - mid,
                transitionDelay: `${Math.abs(i - mid) * 40}ms`,
              } as React.CSSProperties
            }
          >
            {/* Full-set-width image, shifted so this panel shows its slice */}
            <div
              className="absolute top-0 h-full"
              style={{
                width: `${(100 / w) * 100}%`,
                left: `${-(left / w) * 100}%`,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes={sizes}
                priority={priority}
                className="object-cover"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
