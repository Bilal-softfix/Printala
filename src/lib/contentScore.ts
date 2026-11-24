import type { Size } from "@/types";

/* Content-quality scoring for product pages (admin SEO tools).
   Mirrors docs/SEO_PLAYBOOK.md: specific name, 150+ char description, 3+ tags. */

const GENERIC = new Set([
  "poster", "posters", "split", "panel", "wall", "art", "print", "photo", "paper", "a4", "a3", "a2", "a1",
  "anime", "girl", "girls", "car", "cars", "bike", "bikes", "legend", "cool", "hd", "for", "room", "home",
  "the", "and", "of", "with", "set", "3", "5", "new", "best", "aesthetic", "motivational",
]);

export const TARGET_PER_CATEGORY = 12;
export const WEEKLY_GOAL = 5;

export type Check = { key: string; ok: boolean; label: string; points: number };

export function contentChecks(p: {
  name: string;
  description?: string;
  tags?: string[] | string;
}): Check[] {
  const name = p.name.trim();
  const desc = (p.description ?? "").trim();
  const tags = Array.isArray(p.tags)
    ? p.tags
    : (p.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean);
  const specificWords = name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !GENERIC.has(w));
  const words = name.split(/\s+/).filter((w) => /^[a-z]/i.test(w));
  const badCaps = words.some((w) => /^[a-z]/.test(w)) && words.some((w) => /^[A-Z]/.test(w));

  return [
    {
      key: "specific",
      ok: specificWords.length >= 2,
      label: "Name says WHAT it is (character / series / model), not just “Anime Poster”",
      points: 30,
    },
    { key: "nameLength", ok: name.length >= 20 && name.length <= 70, label: "Name is 20–70 characters", points: 10 },
    {
      key: "description",
      ok: desc.length >= 150 && desc.toLowerCase() !== name.toLowerCase(),
      label: `Description has 150+ characters (now ${desc.length})`,
      points: 35,
    },
    { key: "tags", ok: tags.length >= 3, label: `3+ tags (now ${tags.length})`, points: 20 },
    { key: "caps", ok: !badCaps, label: "Consistent Title Case in the name", points: 5 },
  ];
}

export const contentScore = (checks: Check[]) =>
  checks.reduce((s, c) => s + (c.ok ? c.points : 0), 0);

/* ── Draft helpers (no AI service needed) ─────────────────────────────── */

const titleCase = (w: string) => (w.length <= 3 && w === w.toUpperCase() ? w : w[0].toUpperCase() + w.slice(1).toLowerCase());

/** Subject phrases from the name, e.g. "Iron man Split Poster" → ["Iron Man"]. */
export function subjectPhrases(name: string) {
  const CONNECT = new Set(["of", "the", "and", "with", "for"]);
  const chunks: string[][] = [[]];
  for (const raw of name.replace(/["'|()]/g, " ").split(/\s+/)) {
    const w = raw.replace(/[^a-z0-9]/gi, "");
    const lw = w.toLowerCase();
    const cur = chunks[chunks.length - 1];
    if (!w) {
      if (cur.length) chunks.push([]);
    } else if (CONNECT.has(lw)) {
      if (cur.length) cur.push(lw); // keep "God of War" together
    } else if (GENERIC.has(lw)) {
      chunks.push([]);
    } else cur.push(titleCase(w));
  }
  return chunks
    .map((c) => {
      while (c.length && CONNECT.has(c[c.length - 1])) c.pop();
      return c.join(" ");
    })
    .filter((c) => c.length > 2);
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = <T,>(arr: T[], seed: number, offset = 0) => arr[(seed + offset) % arr.length];

/** Writes a factual first draft. Varies wording per product to avoid duplicate text. */
export function draftDescription(p: {
  name: string;
  categoryName: string;
  type: string;
  panels?: string | number;
  sizes: Size[];
  tags: string[];
  price?: number;
}) {
  const seed = hash(p.name);
  const isSplit = p.type === "split-poster";
  const fromName = subjectPhrases(p.name);
  const fromTags = p.tags.filter((t) => !/poster|split|wall|art|decor/i.test(t));
  const about = fromName[0] ?? fromTags[0] ?? p.categoryName.toLowerCase();
  const sizes = p.sizes.map((s) => s.label).join(", ");

  const openers = [
    `Bring ${about} to your wall with the ${p.name}.`,
    `The ${p.name} is made for true ${p.categoryName.toLowerCase()} fans.`,
    `Give your room a bold upgrade with the ${p.name}.`,
  ];
  const format = isSplit
    ? [
        `This ${p.panels || 3}-panel split poster spreads one artwork across separate panels that hang side by side for a large, gallery-style display.`,
        `Split across ${p.panels || 3} panels, it turns a plain wall into a statement piece without needing a frame.`,
      ]
    : [
        "Its striking design makes it an instant focal point above a bed, desk or gaming setup.",
        "Clean composition and rich detail make it look great from across the room.",
      ];
  const quality = [
    "Printed on thick 300gsm matte art paper, the colours stay vivid with no glare — even under tube lights or RGB strips.",
    "We print it on premium 300gsm matte paper for deep colours and a glare-free finish that looks great in any light.",
  ];
  const fits = [
    "Perfect for bedrooms, hostel and PG rooms, study corners and gaming rooms — and a great gift for any fan.",
    "It suits bedrooms, gaming setups, offices and hostel rooms, and makes an easy, memorable gift.",
  ];
  const close = sizes
    ? `Available in ${sizes}. Ships rolled in a rigid tube across India, with Cash on Delivery available.`
    : "Ships rolled in a rigid tube across India, with Cash on Delivery available.";

  return [pick(openers, seed), pick(format, seed, 1), pick(quality, seed, 2), pick(fits, seed, 3), close].join(" ");
}

/** Tag ideas from the name + category (admin picks/edits). */
export function suggestTags(name: string, category: string, type: string) {
  const phrases = subjectPhrases(name)
    .map((p) => p.toLowerCase().split(" ").slice(0, 4).join(" "));
  const base = [category.replace("-", " "), type === "split-poster" ? "split poster" : "poster"];
  const extra = phrases.map((p) => `${p} poster`);
  return [...new Set([...phrases, ...extra, ...base, "wall art", "room decor"])].slice(0, 8);
}
