"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw } from "lucide-react";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { SERVER } from "@/lib/content";
import { cn } from "@/lib/utils";

type Phase = "idle" | "type" | "flood" | "fade" | "rest";

const HEADLINE_LENGTH = 16;
const ROWS = 18;
const ROW_TEXT = "W".repeat(64);

/** Delay before the nth W — starts deliberate, then accelerates. */
const typeDelay = (n: number) => Math.max(45, 260 * Math.pow(0.82, n));

export function EndingScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.6, once: true });
  const reduceMotion = useReducedMotion();
  const { replayOpening } = useExperience();
  const { unlock, notify } = useEasterEggs();

  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    setPhase("type");
    setCount(0);
  }, [inView, run]);

  // Type the headline one W at a time.
  useEffect(() => {
    if (phase !== "type") return;
    if (count >= HEADLINE_LENGTH) {
      const t = window.setTimeout(() => setPhase("flood"), 250);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCount((c) => c + 1), reduceMotion ? 20 : typeDelay(count));
    return () => window.clearTimeout(t);
  }, [phase, count, reduceMotion]);

  useEffect(() => {
    if (phase === "flood") {
      const t = window.setTimeout(() => setPhase("fade"), 3600);
      return () => window.clearTimeout(t);
    }
    if (phase === "fade") {
      const t = window.setTimeout(() => setPhase("rest"), 2800);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  const flooding = phase === "flood" || phase === "fade";
  const showWords = phase === "type" || flooding;

  const onLastDot = () => {
    unlock("sampai-akhir");
    notify("makasih udah sampai sini, atlet.");
  };

  return (
    <section ref={sectionRef} id="ending" className="relative h-[100svh] min-h-[560px] overflow-clip bg-void">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void to-transparent" />

      {/* Flood rows */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center overflow-clip"
        animate={
          phase === "fade"
            ? { opacity: 0, filter: "blur(14px)", scale: 1.06 }
            : { opacity: 1, filter: "blur(0px)", scale: 1 }
        }
        transition={{ duration: phase === "fade" ? 2.6 : 0, ease: [0.65, 0, 0.35, 1] }}
      >
        {flooding &&
          Array.from({ length: ROWS }, (_, i) => {
            const fromCenter = Math.abs(i - (ROWS - 1) / 2);
            const delay = Math.pow(fromCenter, 1.15) * 0.14;
            const reverse = i % 2 === 1;
            return (
              <motion.p
                key={`${run}-${i}`}
                className={cn(
                  "shrink-0 font-black leading-[0.92] tracking-[-0.04em] whitespace-nowrap",
                  fromCenter < 2 ? "text-white" : fromCenter < 5 ? "text-neon/80" : "text-crimson/50",
                  reverse && "self-end",
                )}
                style={{ fontSize: "clamp(2.2rem, 7.5vh, 5rem)" }}
                initial={{ clipPath: reverse ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0%)" }}
                transition={{ delay, duration: 1.6, ease: [0.55, 0, 0.1, 1] }}
              >
                {ROW_TEXT}
              </motion.p>
            );
          })}
      </motion.div>

      {/* Headline */}
      <AnimatePresence>
        {showWords && (
          <motion.div
            className="absolute inset-0 z-10 grid place-items-center px-4"
            exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: 2.4 } }}
          >
            <motion.p
              aria-label="WWWWWWWWWWWWWWWW"
              className={cn(
                "max-w-full text-center font-black tracking-[-0.04em] break-all text-white transition-[text-shadow,background-color] duration-700",
                flooding && "rounded-2xl bg-void/80 px-4 py-2 text-glow backdrop-blur-sm",
              )}
              style={{ fontSize: "clamp(2.2rem, 9vw, 6.5rem)" }}
              animate={phase === "fade" ? { opacity: 0, letterSpacing: "0.2em" } : { opacity: 1 }}
              transition={{ duration: 2.4 }}
            >
              {"W".repeat(count)}
              {phase === "type" && <span className="ml-1 inline-block h-[0.75em] w-[0.08em] animate-blink bg-neon align-baseline" aria-hidden />}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* After the storm */}
      <AnimatePresence>
        {phase === "rest" && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.4 }}
          >
            <p className="font-serif text-[clamp(2rem,7vw,3.5rem)] text-white italic">Terima kasih, Ketum.</p>
            <p className="eyebrow mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
              <span>{SERVER.name}</span>
              <span>· #{SERVER.channel}</span>
              <span className="whitespace-nowrap">· Status: {SERVER.status}</span>
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 font-mono text-xs tracking-[0.2em] text-white/70 uppercase transition-colors hover:border-white/40 hover:text-white"
              >
                <RotateCcw className="size-3.5" /> W lagi
              </button>
              <button
                type="button"
                onClick={replayOpening}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-5 font-mono text-xs tracking-[0.2em] text-white uppercase transition-colors hover:border-neon/70"
              >
                <ArrowUp className="size-3.5" /> Dari awal
              </button>
            </div>
            <button
              type="button"
              onClick={onLastDot}
              aria-label="titik"
              className="absolute bottom-10 left-1/2 grid size-10 -translate-x-1/2 place-items-center text-white/[0.06] transition-colors duration-700 hover:text-white/30"
            >
              ·
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
