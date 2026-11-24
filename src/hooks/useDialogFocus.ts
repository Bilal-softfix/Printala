"use client";

import { RefObject, useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog focus (A3): moves focus inside when `active`, optionally
 * traps Tab, closes on Escape, and restores focus to the trigger on close.
 */
export function useDialogFocus(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  { onEscape, trap = true }: { onEscape?: () => void; trap?: boolean } = {},
) {
  // Latest callback without re-running the effect (parents may pass inline fns).
  const escRef = useRef(onEscape);
  useEffect(() => {
    escRef.current = onEscape;
  });

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const trigger = document.activeElement as HTMLElement | null;

    const items = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (!el.contains(document.activeElement)) items()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return escRef.current?.();
      if (!trap || e.key !== "Tab") return;
      const list = items();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus?.();
    };
  }, [ref, active, trap]);
}
