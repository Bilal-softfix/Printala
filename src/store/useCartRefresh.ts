"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "./cartStore";

/** Syncs cart prices/stock with the API once when a page mounts (F4). */
export function useCartRefresh() {
  const refreshItems = useCartStore((s) => s.refreshItems);
  useEffect(() => {
    refreshItems().then((removed) => {
      if (removed.length)
        toast.error(`Removed (no longer available): ${removed.join(", ")}`, { duration: 6000 });
    });
  }, [refreshItems]);
}
