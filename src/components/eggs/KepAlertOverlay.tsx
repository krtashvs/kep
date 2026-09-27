"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { AlertStage } from "@/components/ui/AlertStage";
import { Portal } from "@/components/ui/Portal";
import { useBodyLock } from "@/hooks/useBodyLock";

const AUTO_CLOSE_MS = 3200;

export function KepAlertOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, AUTO_CLOSE_MS);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            role="alertdialog"
            aria-label="KEP ALERT"
            className="fixed inset-0 z-[90] cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
            transition={{ duration: 0.45 }}
          >
            <AlertStage title="KETUM ALERT" subtitle="Alarm dibunyikan ulang">
              <p className="mt-10 font-mono text-[0.65rem] tracking-[0.3em] text-white/50 uppercase">ketuk untuk menutup</p>
            </AlertStage>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
