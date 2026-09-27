"use client";

import { useEffect, useRef } from "react";

type SequenceMap = Record<string, () => void>;

const KEY_ALIASES: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * Fires a callback whenever the user types one of the given sequences anywhere
 * on the page. Arrow keys are normalised to ↑↓←→ so Konami-style codes work.
 */
export function useKeySequences(sequences: SequenceMap): void {
  const buffer = useRef("");
  const latest = useRef(sequences);
  latest.current = sequences;

  useEffect(() => {
    const maxLength = Math.max(...Object.keys(latest.current).map((s) => s.length));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTypingTarget(event.target)) return;
      const key = KEY_ALIASES[event.key] ?? (event.key.length === 1 ? event.key.toLowerCase() : "");
      if (!key) return;

      buffer.current = (buffer.current + key).slice(-maxLength);
      for (const [sequence, callback] of Object.entries(latest.current)) {
        if (buffer.current.endsWith(sequence)) {
          buffer.current = "";
          callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
