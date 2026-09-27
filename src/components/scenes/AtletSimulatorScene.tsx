"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Send, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { KepAvatar } from "@/components/ui/KepAvatar";
import { Portal } from "@/components/ui/Portal";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useBodyLock } from "@/hooks/useBodyLock";
import {
  ATLET_CHOICES,
  RARE_CHANCE,
  SERVER,
  TAMPIL_STREAK_TARGET,
  type AtletChoice,
  type ChoiceKey,
  type OutcomeKind,
} from "@/lib/content";
import { cn, randomItem } from "@/lib/utils";

type Phase = "choose" | "sending" | "result";
type FreezeStage = null | "typing" | "cek";

const SEND_MS = 1500;
const FREEZE_TYPING_MS = 3000;
const FREEZE_CEK_MS = 1700;
const COMMON_OUTCOMES: OutcomeKind[] = ["offline", "seen", "aura"];

function rollOutcome(choice: ChoiceKey, tampilStreak: number): OutcomeKind {
  if (choice === "D" && tampilStreak >= TAMPIL_STREAK_TARGET) return "rare";
  if (Math.random() < RARE_CHANCE) return "rare";
  return randomItem(COMMON_OUTCOMES);
}

export function AtletSimulatorScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.5 });
  const { addAura, aura, unlock, openVault } = useEasterEggs();

  const [phase, setPhase] = useState<Phase>("choose");
  const [choice, setChoice] = useState<AtletChoice | null>(null);
  const [outcome, setOutcome] = useState<OutcomeKind | null>(null);
  const [freeze, setFreeze] = useState<FreezeStage>(null);
  const [tampilStreak, setTampilStreak] = useState(0);
  const tried = useRef(new Set<ChoiceKey>());
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const choose = useCallback(
    (picked: AtletChoice) => {
      if (phase !== "choose") return;
      const streak = picked.key === "D" ? tampilStreak + 1 : 0;
      const result = rollOutcome(picked.key, streak);

      tried.current.add(picked.key);
      if (tried.current.size === ATLET_CHOICES.length) unlock("atlet-sejati");

      setChoice(picked);
      setPhase("sending");
      setTampilStreak(result === "rare" ? 0 : streak);

      if (result !== "rare") {
        later(() => {
          setOutcome(result);
          setPhase("result");
          if (result === "aura") addAura(1);
        }, SEND_MS);
        return;
      }

      later(() => setFreeze("typing"), SEND_MS);
      later(() => setFreeze("cek"), SEND_MS + FREEZE_TYPING_MS);
      later(() => {
        setFreeze(null);
        setOutcome("rare");
        setPhase("result");
      }, SEND_MS + FREEZE_TYPING_MS + FREEZE_CEK_MS);
      later(openVault, SEND_MS + FREEZE_TYPING_MS + FREEZE_CEK_MS + 900);
    },
    [phase, tampilStreak, later, unlock, addAura, openVault],
  );

  const reset = () => {
    setPhase("choose");
    setChoice(null);
    setOutcome(null);
  };

  // A–D shortcuts while the simulator is on screen.
  useEffect(() => {
    if (!inView || phase !== "choose") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const picked = ATLET_CHOICES.find((c) => c.key === event.key.toUpperCase());
      if (picked) choose(picked);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, phase, choose]);

  return (
    <section ref={sectionRef} id="simulator" className="relative px-4 py-24 sm:py-32">
      <SectionHeading index="04" eyebrow="Atlet Simulator" title="Lu adalah atlet daget." description="Apa langkah selanjutnya?" />

      <motion.div
        className="glass relative mx-auto max-w-2xl overflow-hidden rounded-[28px]"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />
        <div className="flex items-center justify-between border-b hairline px-5 py-3.5 font-mono text-[0.7rem] text-stitch sm:px-7">
          <span className="tracking-[0.2em] uppercase">sim://atlet · #{SERVER.channel}</span>
          <span className="inline-flex items-center gap-1.5 text-white/80">
            <Sparkles className="size-3.5 text-neon" /> Aura <b className="tabular-nums text-white">{aura}</b>
          </span>
        </div>

        <div className="min-h-[340px] p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {phase === "choose" && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.4 }}
              >
                <p className="mb-5 text-sm text-stitch">Pilih dengan bijak. Atau tidak.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ATLET_CHOICES.map((option, i) => (
                    <motion.button
                      key={option.key}
                      type="button"
                      onClick={() => choose(option)}
                      className="group relative flex h-16 items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30 px-4 text-left transition-[border-color,background-color,box-shadow] duration-300 hover:border-neon/50 hover:bg-neon/[0.07] hover:shadow-[0_0_40px_-12px_var(--color-neon)] focus-visible:ring-2 focus-visible:ring-neon focus-visible:outline-none"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-sm font-semibold text-white transition-colors group-hover:border-neon/50 group-hover:text-neon">
                        {option.key}
                      </span>
                      <span className="text-base font-medium text-white">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
                <p className="mt-5 hidden font-mono text-[0.65rem] tracking-[0.2em] text-stitch/50 uppercase sm:block">tekan A · B · C · D</p>
              </motion.div>
            )}

            {phase === "sending" && choice && (
              <motion.div
                key="sending"
                className="flex min-h-[290px] flex-col justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
              >
                <p className="eyebrow mb-3">
                  {choice.key}. {choice.label}
                </p>
                <p className="text-lg text-white">{choice.action}</p>
                <div className="mt-8 flex items-center gap-3 font-mono text-xs text-stitch">
                  <Send className="size-3.5 text-neon" /> mengirim ke #{SERVER.channel}…
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-crimson to-neon"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SEND_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
                  />
                </div>
              </motion.div>
            )}

            {phase === "result" && outcome && (
              <motion.div
                key="result"
                className="flex min-h-[290px] flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <OutcomeView outcome={outcome} aura={aura} />
                {choice?.key === "D" && tampilStreak === TAMPIL_STREAK_TARGET - 1 && outcome !== "rare" && (
                  <motion.p
                    className="mt-6 font-serif text-sm text-stitch/60 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 1.2 }}
                  >
                    Atlet sejati tidak berhenti tampil.
                  </motion.p>
                )}
                <motion.button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 font-mono text-xs tracking-[0.2em] text-white/80 uppercase transition-colors hover:border-neon/50 hover:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: outcome === "seen" ? 2.6 : 0.8 }}
                >
                  <RotateCcw className="size-3.5" /> Coba lagi
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <FreezeOverlay stage={freeze} />
    </section>
  );
}

function OutcomeView({ outcome, aura }: { outcome: OutcomeKind; aura: number }) {
  switch (outcome) {
    case "offline":
      return (
        <>
          <KepAvatar size={72} ring={false} heat={0} status="offline" className="grayscale" />
          <p className="mt-5 text-xl font-medium text-white">Bang Kep sedang offline.</p>
          <p className="mt-2 text-sm text-stitch">Pesanmu tenggelam di antara 1.000+ QR lainnya.</p>
        </>
      );
    case "seen":
      return (
        <div className="space-y-3">
          {["Bang Kep melihat pesanmu.", "...", "Tidak terjadi apa-apa."].map((line, i) => (
            <motion.p
              key={line}
              className={cn(i === 1 ? "font-mono text-3xl tracking-[0.4em] text-neon" : "text-xl text-white", i === 2 && "text-stitch")}
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: [0, 0.9, 2][i], duration: 0.7 }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      );
    case "aura":
      return (
        <>
          <motion.p
            className="text-[clamp(3.5rem,14vw,6rem)] leading-none font-black tracking-tight text-white text-glow"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 14 }}
          >
            +1 Aura
          </motion.p>
          <p className="mt-4 font-mono text-xs tracking-[0.25em] text-stitch uppercase">Total aura: {aura}</p>
        </>
      );
    case "rare":
      return (
        <>
          <p className="eyebrow mb-4 text-neon">Rare ending · 5%</p>
          <p className="text-6xl font-black tracking-tight text-white text-glow">cek</p>
          <p className="mt-4 text-sm text-stitch">Bang Kep mengecek kamu. Kamu terlihat.</p>
        </>
      );
  }
}

/** The whole screen stops. Only one thing moves: the typing indicator. */
function FreezeOverlay({ stage }: { stage: FreezeStage }) {
  useBodyLock(stage !== null);

  return (
    <Portal>
      <AnimatePresence>
        {stage && (
          <motion.div
            className="fixed inset-0 z-[88] grid place-items-center bg-black/70 backdrop-blur-[2px] backdrop-grayscale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 0.08 }}
          >
            <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
            <AnimatePresence mode="wait">
              {stage === "typing" ? (
                <motion.p
                  key="typing"
                  className="px-6 text-center font-mono text-[clamp(1.2rem,5vw,2.5rem)] tracking-[0.1em] text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  KEP IS TYPING...
                  <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] animate-blink bg-neon" aria-hidden />
                </motion.p>
              ) : (
                <motion.p
                  key="cek"
                  className="text-[clamp(5rem,25vw,14rem)] leading-none font-black tracking-[-0.05em] text-white text-glow"
                  initial={{ opacity: 0, scale: 1.3, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  cek
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
