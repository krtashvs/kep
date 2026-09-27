"use client";

import { useCallback, useRef } from "react";

/**
 * Counts taps that land within `windowMs` of each other.
 * Returns a handler that reports the running streak on every tap.
 */
export function useRapidTaps(onTap: (streak: number) => void, windowMs = 650) {
  const streak = useRef(0);
  const last = useRef(0);
  const callback = useRef(onTap);
  callback.current = onTap;

  return useCallback(() => {
    const now = performance.now();
    streak.current = now - last.current < windowMs ? streak.current + 1 : 1;
    last.current = now;
    callback.current(streak.current);
  }, [windowMs]);
}
