"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AlertStage } from "@/components/ui/AlertStage";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useBodyLock } from "@/hooks/useBodyLock";
import { OPENING_LINES } from "@/lib/content";

const LINE_MS = 1900;
const LEAD_IN_MS = 700;

type Phase = { name: "lines"; index: number } | { name: "alarm" };

export function OpeningSequence() {
  const { entered, enter } = useExperience();
  const [phase, setPhase] = useState<Phase>({ name: "lines", index: -1 });
  const [armed, setArmed] = useState(false);
  useBodyLock(!entered);

  // Reset whenever the opening is replayed.
  useEffect(() => {
    if (!entered) {
      setPhase({ name: "lines", index: -1 });
      setArmed(false);
    }
  }, [entered]);

  useEffect(() => {
    if (entered || phase.name !== "lines") return;
    const isLast = phase.index === OPENING_LINES.length - 1;
    const timer = window.setTimeout(
      () => setPhase(isLast ? { name: "alarm" } : { name: "lines", index: phase.index + 1 }),
      phase.index < 0 ? LEAD_IN_MS : LINE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [entered, phase]);

  useEffect(() => {
    if (phase.name !== "alarm") return;
    const timer = window.setTimeout(() => setArmed(true), 1100);
    return () => window.clearTimeout(timer);
  }, [phase.name]);

  const skipOrEnter = useCallback(() => {
    if (phase.name === "lines") setPhase({ name: "alarm" });
    else if (armed) enter();
  }, [phase.name, armed, enter]);

  useEffect(() => {
    if (entered) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        skipOrEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered, skipOrEnter]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="opening"
          className="fixed inset-0 z-[80] bg-black"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(18px)" }}
          transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
        >
          <AnimatePresence mode="wait">
            {phase.name === "lines" ? (
              <motion.div key="lines" className="absolute inset-0 grid place-items-center" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <AnimatePresence mode="wait">
                  {phase.index >= 0 && (
                    <motion.p
                      key={phase.index}
                      className="px-6 text-center font-mono text-sm tracking-[0.45em] text-white/85 uppercase sm:text-lg"
                      initial={{ opacity: 0, y: 6, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(8px)" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {phase.index === OPENING_LINES.length - 1 && (
                        <span className="mr-3 inline-block size-2 translate-y-[-2px] animate-pulse rounded-full bg-neon shadow-[0_0_12px_var(--color-neon)]" />
                      )}
                      {OPENING_LINES[phase.index]}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={skipOrEnter}
                  className="absolute right-5 bottom-6 font-mono text-[0.65rem] tracking-[0.3em] text-white/25 uppercase transition-colors hover:text-white/70"
                >
                  lewati
                </button>
              </motion.div>
            ) : (
              <motion.div key="alarm" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
                <AlertStage title="KETUM ALERT" subtitle="Kep terdeteksi di daget">
                  <motion.button
                    type="button"
                    onClick={enter}
                    disabled={!armed}
                    className="group relative mt-12 inline-flex h-14 items-center gap-3 overflow-hidden rounded-full border border-white/25 bg-black/40 px-10 font-mono text-sm font-semibold tracking-[0.4em] text-white uppercase backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-white/70 hover:shadow-[0_0_40px_-6px_var(--color-neon)] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                    initial={{ opacity: 0, y: 16 }}
                    animate={armed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    Masuk
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </AlertStage>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
