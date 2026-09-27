"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { ASSETS } from "@/lib/assets";

export interface ToastItem {
  id: number;
  kind: "achievement" | "message";
  title: string;
  body: string;
  icon?: string;
}

export function AchievementToasts({ toasts }: { toasts: ToastItem[] }) {
  return (
    <Portal>
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[85] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 40, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass pointer-events-auto flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-2xl px-4 py-3"
            >
              {toast.kind === "achievement" ? (
                <>
                  <div className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-crimson to-blood text-xl shadow-[0_0_24px_-4px_var(--color-neon)]">
                    <span aria-hidden>{toast.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.25em] text-neon uppercase">
                      <Trophy className="size-3" /> Achievement unlocked
                    </p>
                    <p className="truncate text-sm font-semibold text-white">{toast.title}</p>
                    <p className="truncate text-xs text-stitch">{toast.body}</p>
                  </div>
                </>
              ) : (
                <>
                  <Image src={ASSETS.avatar} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-kep">{toast.title}</p>
                    <p className="text-sm text-white/90">{toast.body}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Portal>
  );
}
