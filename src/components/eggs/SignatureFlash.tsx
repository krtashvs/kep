"use client";

import { motion } from "framer-motion";
import { Portal } from "@/components/ui/Portal";

/** Blink-and-you-miss-it. One second, then gone. */
export function SignatureFlash() {
  return (
    <Portal>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] grid place-items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1, times: [0, 0.15, 0.8, 1], ease: "easeInOut" }}
      >
        <span className="font-mono text-sm tracking-[0.5em] text-white/80 lowercase">krtashvs</span>
      </motion.div>
    </Portal>
  );
}
