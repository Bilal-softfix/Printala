/* Shared motion language for the redesign — keep timing consistent site-wide. */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT = { once: true, margin: "-80px" } as const;

/** Masked line reveal: wrap in an overflow-hidden parent. */
export const lineReveal = {
  hidden: { y: "105%" },
  show: (i: number = 0) => ({
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 },
  }),
};

/** Image wipe from bottom to top. */
export const clipReveal = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: (i: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.1, ease: EASE, delay: i * 0.07 },
  }),
};
