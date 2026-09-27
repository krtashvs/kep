"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Lock, X } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useBodyLock } from "@/hooks/useBodyLock";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { cn } from "@/lib/utils";

export function AchievementsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { unlocked, aura, vaultUnlocked, openVault } = useEasterEggs();
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Secret entries stay invisible until found; only the total hints they exist.
  const visible = ACHIEVEMENTS.filter((a) => !a.secret || unlocked.has(a.id));

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[75]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.aside
              role="dialog"
              aria-label="Achievements"
              className="glass absolute inset-x-0 bottom-0 max-h-[82svh] overflow-y-auto rounded-t-[28px] p-5 sm:inset-y-3 sm:right-3 sm:left-auto sm:max-h-none sm:w-[380px] sm:rounded-[24px]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="eyebrow">Achievements</p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {unlocked.size}
                    <span className="text-stitch">/{ACHIEVEMENTS.length}</span>
                  </p>
                  <p className="mt-1 font-mono text-xs text-stitch">✦ {aura} aura</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-white/70 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>

              <ul className="space-y-2">
                {visible.map((achievement) => {
                  const got = unlocked.has(achievement.id);
                  return (
                    <li
                      key={achievement.id}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3 py-3",
                        got ? "border-white/10 bg-white/[0.04]" : "border-white/[0.04] bg-black/20",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl text-lg",
                          got ? "bg-gradient-to-br from-crimson to-blood" : "bg-white/[0.04] text-stitch/40",
                        )}
                      >
                        {got ? achievement.icon : <Lock className="size-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-semibold", got ? "text-white" : "text-stitch/50")}>{got ? achievement.title : "???"}</p>
                        <p className="truncate text-xs text-stitch/70">{got ? achievement.description : "Belum ditemukan."}</p>
                      </div>
                      {got && achievement.id === "terlihat" && vaultUnlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            openVault();
                          }}
                          className="shrink-0 rounded-full border border-neon/40 px-3 py-1 font-mono text-[0.65rem] tracking-[0.15em] text-neon uppercase hover:bg-neon/10"
                        >
                          Buka
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
