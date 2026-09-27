"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Hash, RotateCcw, TriangleAlert } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QrRainCanvas } from "@/components/ui/QrRainCanvas";
import { KepAvatar } from "@/components/ui/KepAvatar";
import { DummyQr } from "@/components/ui/DummyQr";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { PROFILE, SERVER, SPAM_LINES } from "@/lib/content";
import { cn, randomItem } from "@/lib/utils";

type Phase = "idle" | "typing" | "message" | "chaos";

interface SpamMessage {
  id: number;
  name: string;
  color: string;
  text: string;
  qr: boolean;
}

const ATLETS = [
  { name: "atlet_01", color: "#9fb2ff" },
  { name: "si paling tampil", color: "#ff6b5a" },
  { name: "ngolah.master", color: "#c4b5fd" },
  { name: "qr enjoyer", color: "#86efac" },
  { name: "anak daget", color: "#f9a8d4" },
  { name: "izin tampil", color: "#fcd34d" },
  { name: "nicegang", color: "#67e8f9" },
] as const;

const TYPING_MS = 2600;
const MESSAGE_MS = 900;
const SPAM_EVERY_MS = 240;

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-current"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function QrPanicScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggered = useInView(sectionRef, { amount: 0.4, once: true });
  const inView = useInView(sectionRef, { amount: 0.05 });
  const { rainQr, unlock } = useEasterEggs();
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const [spam, setSpam] = useState<SpamMessage[]>([]);
  const spamId = useRef(0);

  useEffect(() => {
    if (!triggered) return;
    setPhase("typing");
    setSpam([]);
    const toMessage = window.setTimeout(() => setPhase("message"), TYPING_MS);
    const toChaos = window.setTimeout(() => setPhase("chaos"), TYPING_MS + MESSAGE_MS);
    return () => {
      window.clearTimeout(toMessage);
      window.clearTimeout(toChaos);
    };
  }, [triggered, run]);

  useEffect(() => {
    if (phase !== "chaos" || !inView) return;
    const id = window.setInterval(() => {
      const atlet = randomItem(ATLETS);
      const qr = Math.random() < 0.3;
      const message: SpamMessage = { id: ++spamId.current, ...atlet, text: qr ? "" : randomItem(SPAM_LINES), qr };
      setSpam((current) => [...current.slice(-5), message]);
    }, SPAM_EVERY_MS);
    return () => window.clearInterval(id);
  }, [phase, inView]);

  const chaos = phase === "chaos";

  const onJejerinTap = () => {
    rainQr();
    unlock("hujan");
  };

  return (
    <section ref={sectionRef} id="panic" className="relative min-h-[100svh] overflow-clip px-4 py-24 sm:py-32">
      {/* Chaos layers */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: chaos ? 1 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 animate-siren bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,42,61,0.28),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-void),transparent_20%,transparent_80%,var(--color-void))]" />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <QrRainCanvas active={chaos && inView} density={22} />
      </div>

      <div className="relative z-10">
        <SectionHeading
          index="03"
          eyebrow="QR Panic Mode"
          title={
            <>
              Semua tenang.
              <br />
              <span className="text-stitch">Sampai dia mengetik.</span>
            </>
          }
        />

        {/* Center stage */}
        <div className="flex min-h-[200px] flex-col items-center justify-center text-center sm:min-h-[240px]">
          <AnimatePresence mode="wait">
            {phase === "typing" && (
              <motion.p
                key="typing"
                className="font-mono text-[clamp(1.4rem,6vw,3.5rem)] font-semibold tracking-[0.08em] text-white"
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
              >
                KEP IS TYPING
                <span className="text-neon">...</span>
                <span className="ml-1 inline-block h-[0.9em] w-[0.5em] translate-y-[0.12em] animate-blink bg-neon" aria-hidden />
              </motion.p>
            )}

            {(phase === "message" || chaos) && (
              <motion.div
                key="message"
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <KepAvatar size={28} ring={false} heat={0} />
                  <span className="font-semibold text-kep">{PROFILE.displayName}</span>
                  <span className="rounded border border-white/10 bg-white/5 px-1 text-[0.65rem] font-semibold text-white/80">🏆 {PROFILE.serverTag}</span>
                  <span className="text-xs text-stitch/70">hari ini 16.41</span>
                </div>
                <button
                  type="button"
                  onClick={onJejerinTap}
                  className={cn(
                    "text-[clamp(3.5rem,16vw,9rem)] leading-none font-black tracking-[-0.05em] text-white transition-[text-shadow] duration-700 focus-visible:outline-none",
                    chaos && "text-glow",
                  )}
                >
                  jejerin
                </button>
                <AnimatePresence>
                  {chaos && (
                    <motion.p
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-neon/50 bg-neon/10 px-3 py-1 font-mono text-[0.65rem] tracking-[0.3em] text-neon uppercase"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <TriangleAlert className="size-3" /> QR panic mode aktif
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Discord window */}
        <motion.div
          className={cn(
            "mx-auto mt-10 max-w-xl overflow-hidden rounded-2xl border bg-discord/90 shadow-2xl backdrop-blur transition-colors duration-700",
            chaos ? "border-neon/30 shadow-[0_0_80px_-30px_var(--color-neon)]" : "border-white/[0.07]",
          )}
          animate={chaos ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 border-b border-black/40 px-4 py-3 text-sm font-semibold text-white">
            <Hash className="size-4 text-stitch" />
            <span>
              {SERVER.channelEmoji}・{SERVER.channel}
            </span>
            {chaos && <span className="ml-auto font-mono text-[0.65rem] font-normal text-neon">slowmode diabaikan</span>}
          </div>

          <div className="relative h-[268px] overflow-hidden px-4 py-3">
            <div className="absolute inset-x-4 bottom-3 flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {spam.map((message) => (
                  <motion.div
                    key={message.id}
                    layout="position"
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="mt-0.5 size-8 shrink-0 rounded-full" style={{ background: `linear-gradient(135deg, ${message.color}, #1e1f22)` }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold" style={{ color: message.color }}>
                        {message.name}
                      </p>
                      {message.qr ? (
                        <DummyQr seed={message.id * 7919} className="mt-1 size-14 rounded" />
                      ) : (
                        <p className="truncate text-[0.95rem] text-white/90">{message.text}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {!chaos && spam.length === 0 && (
              <p className="absolute inset-0 grid place-items-center text-sm text-stitch/60">Belum ada pesan. Untuk sekarang.</p>
            )}
          </div>

          <div className="px-4 pb-3">
            <div className="rounded-lg bg-discord-2 px-4 py-3 text-sm text-stitch/60">
              Kirim pesan ke #{SERVER.channelEmoji}・{SERVER.channel}
            </div>
            <div className="mt-1.5 flex h-5 items-center gap-2 text-xs text-stitch">
              {phase === "typing" && (
                <>
                  <TypingDots /> <span>
                    <b className="text-white/90">kep</b> sedang mengetik…
                  </span>
                </>
              )}
              {chaos && (
                <>
                  <TypingDots /> <span>
                    <b className="text-white/90">347 atlet</b> sedang mengetik…
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex h-10 justify-center">
          <AnimatePresence>
            {chaos && (
              <motion.button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-5 font-mono text-xs tracking-[0.2em] text-white/80 uppercase backdrop-blur transition-colors hover:border-white/40 hover:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 3 } }}
                exit={{ opacity: 0 }}
              >
                <RotateCcw className="size-3.5" /> Ulangi
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
