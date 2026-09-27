"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { useBodyLock } from "@/hooks/useBodyLock";
import { ASSETS } from "@/lib/assets";

type Phase = "granted" | "seen" | "reveal";

const PHASE_TIMINGS: Array<[Phase, number]> = [
  ["seen", 1700],
  ["reveal", 3300],
];

/**
 * The hidden reward. Never mounted with content until an easter egg path
 * calls `openVault()`; the image itself only loads in the reveal phase.
 */
export function SecretVault({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("granted");
  const closeRef = useRef<HTMLButtonElement>(null);
  useBodyLock(open);

  // The reveal choreography depends on `open` alone so re-renders never restart it.
  // Reset before paint so a reopened vault never flashes its last phase.
  useLayoutEffect(() => {
    if (open) setPhase("granted");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timers = PHASE_TIMINGS.map(([next, at]) => window.setTimeout(() => setPhase(next), at));
    return () => timers.forEach(window.clearTimeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (phase === "reveal") closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Access granted"
            className="fixed inset-0 z-[100] overflow-y-auto bg-void/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 0.5 }}
          >
            <div className="scanlines pointer-events-none fixed inset-0 opacity-40" />
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,16,29,0.28),transparent_60%)]" />

            <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-16 text-center">
              <AnimatePresence mode="wait">
                {phase === "granted" && (
                  <motion.div
                    key="granted"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="eyebrow mb-4 text-neon">auth.override // level 5</p>
                    <h2 className="relative font-mono text-[clamp(2.2rem,9vw,5.5rem)] font-bold tracking-tight text-white">
                      ACCESS GRANTED
                      <span aria-hidden className="absolute inset-0 animate-glitch text-neon mix-blend-screen">
                        ACCESS GRANTED
                      </span>
                      <span aria-hidden className="absolute inset-0 translate-x-[2px] animate-glitch text-blurple mix-blend-screen [animation-delay:-0.3s]">
                        ACCESS GRANTED
                      </span>
                    </h2>
                  </motion.div>
                )}

                {phase === "seen" && (
                  <motion.p
                    key="seen"
                    className="font-serif text-[clamp(1.8rem,7vw,4rem)] leading-tight text-white italic"
                    initial={{ opacity: 0, letterSpacing: "0.2em", filter: "blur(10px)" }}
                    animate={{ opacity: 1, letterSpacing: "0em", filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    “ATLET BERHASIL TERLIHAT”
                  </motion.p>
                )}

                {phase === "reveal" && (
                  <motion.div
                    key="reveal"
                    className="flex w-full max-w-sm flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <p className="eyebrow mb-2">hidden reward</p>
                    <p className="mb-6 text-sm text-stitch">Hanya untuk yang benar-benar tampil.</p>
                    <motion.div
                      className="relative w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_0_80px_-20px_var(--color-neon)]"
                      initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(16px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    >
                      <Image
                        src={ASSETS.vault}
                        alt="QRIS"
                        width={1170}
                        height={1648}
                        sizes="(max-width: 640px) 90vw, 384px"
                        className="h-auto w-full"
                      />
                    </motion.div>
                    <motion.button
                      ref={closeRef}
                      type="button"
                      onClick={onClose}
                      className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-medium tracking-wide text-white transition-colors hover:border-neon/60 hover:bg-neon/10 focus-visible:ring-2 focus-visible:ring-neon focus-visible:outline-none"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <X className="size-4" /> Tutup
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
