"use client";

import { useEasterEggs } from "@/components/providers/EasterEggProvider";

/** Barely there. Those who find it get a one-second glimpse. */
export function Watermark() {
  const { flashSignature, unlock } = useEasterEggs();

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={() => {
        flashSignature();
        unlock("bayangan");
      }}
      className="fixed bottom-1.5 left-2 z-[45] cursor-default font-mono text-[9px] tracking-[0.3em] text-white opacity-[0.02] select-none"
    >
      krtashvs
    </button>
  );
}
