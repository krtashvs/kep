"use client";

import { useEffect } from "react";

let locks = 0;

/** Ref-counted body scroll lock, so stacked overlays don't fight. */
export function useBodyLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    document.body.dataset.locked = "true";
    return () => {
      locks = Math.max(0, locks - 1);
      if (locks === 0) delete document.body.dataset.locked;
    };
  }, [active]);
}
