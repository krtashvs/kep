"use client";

import { motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { Check, ChevronDown, Crown, Hash } from "lucide-react";
import { KepAvatar } from "@/components/ui/KepAvatar";
import { TiltCard } from "@/components/ui/TiltCard";
import { CountUp } from "@/components/ui/CountUp";
import { ChatBubbles, type Bubble } from "@/components/ui/ChatBubble";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useRapidTaps } from "@/hooks/useRapidTaps";
import { PROFILE, SERVER } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;
const JEJERIN_AT = 5;
const ALERT_AT = 10;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
};

function useAvatarEggs() {
  const { unlock, triggerAlert } = useEasterEggs();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [streak, setStreak] = useState(0);
  const bubbleId = useRef(0);
  const cool = useRef(0);

  const say = useCallback((text: string) => {
    const id = ++bubbleId.current;
    setBubbles((current) => [...current.slice(-1), { id, text }]);
    window.setTimeout(() => setBubbles((current) => current.filter((b) => b.id !== id)), 1600);
  }, []);

  const onTap = useRapidTaps((count) => {
    setStreak(count);
    window.clearTimeout(cool.current);
    cool.current = window.setTimeout(() => setStreak(0), 1400);

    if (count === ALERT_AT) {
      triggerAlert();
      unlock("alarm");
    } else if (count === JEJERIN_AT) {
      say("jejerin");
      unlock("jejerin");
    } else if (count < JEJERIN_AT) {
      say(count % 2 ? "cek" : "Cek");
      unlock("cek");
    }
  }, 700);

  useEffect(() => () => window.clearTimeout(cool.current), []);

  return { bubbles, heat: Math.min(1, streak / ALERT_AT), onTap };
}

export function HeroScene() {
  const { entered } = useExperience();
  const { unlock, notify, auraMode } = useEasterEggs();
  const { bubbles, heat, onTap } = useAvatarEggs();

  const onNice = () => {
    unlock("nice");
    notify("nice.");
  };

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-clip pt-24 pb-24">
      <div aria-hidden className="grid-bg absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute top-[-20%] left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(163,16,29,0.32),transparent_65%)]" />
      <motion.p
        aria-hidden
        className="pointer-events-none absolute top-[22%] left-1/2 -translate-x-1/2 text-[34vw] leading-none font-black tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgba(255,255,255,0.05)] sm:top-[14%] sm:text-[24vw]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={entered ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 2.2, ease: EASE }}
      >
        KETUM
      </motion.p>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4"
        variants={stagger}
        initial="hidden"
        animate={entered ? "show" : "hidden"}
      >
        <motion.p variants={rise} className="eyebrow mb-10 flex items-center gap-3 text-center">
          <span className="size-1.5 rounded-full bg-neon shadow-[0_0_10px_var(--color-neon)]" />
          {SERVER.name} · Tribute Event
        </motion.p>

        <motion.div variants={rise} className="relative z-20">
          <FloatingChip className="top-4 -left-44" delay={0}>
            <Hash className="size-3.5 text-stitch" /> {SERVER.channelEmoji}・{SERVER.channel}
          </FloatingChip>
          <FloatingChip className="top-24 -right-48" delay={1.2}>
            <span className="size-1.5 rounded-full bg-neon" /> Status: {SERVER.status}
          </FloatingChip>
          <FloatingChip className="-bottom-2 -left-40" delay={2.1}>
            🏆 {PROFILE.serverTag}
          </FloatingChip>

          <ChatBubbles bubbles={bubbles} />
          <KepAvatar
            size={224}
            fluid
            priority
            status="dnd"
            heat={auraMode ? 1 : 0.35 + heat * 0.65}
            onPress={onTap}
            className="size-[168px] sm:size-[212px]"
          />
        </motion.div>

        <motion.div variants={rise} className="-mt-14 w-full max-w-md">
          <TiltCard className="glass rounded-[28px]">
            <div className="relative overflow-hidden rounded-[28px] px-6 pt-20 pb-6 sm:px-8">
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

              <div className="flex flex-wrap items-center justify-center gap-2 text-center">
                <h1 className="text-4xl font-semibold tracking-tight text-kep">{PROFILE.displayName}</h1>
                <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs font-semibold text-white/80">
                  🏆 {PROFILE.serverTag}
                </span>
              </div>
              <p className="mt-1 text-center font-mono text-sm text-stitch">@{PROFILE.username}</p>

              <div className="mt-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-neon/30 bg-neon/10 px-3.5 py-1.5 text-xs font-semibold tracking-[0.2em] text-white uppercase shadow-[0_0_24px_-8px_var(--color-neon)]">
                  <Crown className="size-3.5 text-neon" /> {PROFILE.role}
                </span>
              </div>

              <div className="my-6 h-px bg-white/[0.07]" />

              <p className="eyebrow mb-3">Trait</p>
              <ul className="space-y-2.5">
                {PROFILE.traits.map((trait, i) => (
                  <motion.li
                    key={trait}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 transition-colors duration-300 hover:border-neon/30 hover:bg-neon/[0.06]"
                    initial={{ opacity: 0, x: -12 }}
                    animate={entered ? { opacity: 1, x: 0 } : undefined}
                    transition={{ delay: 1.2 + i * 0.12, duration: 0.7, ease: EASE }}
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-neon/15 text-neon">
                      <Check className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[0.95rem] text-white/90">{trait}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {PROFILE.stats.map((stat) => {
                  const isEgg = "egg" in stat;
                  const Tile: ElementType = isEgg ? "button" : "div";
                  return (
                    <Tile
                      key={stat.label}
                      {...(isEgg && { type: "button", onClick: onNice })}
                      className="group rounded-2xl border border-white/[0.06] bg-black/30 px-4 py-4 text-left transition-colors duration-300 hover:border-white/15"
                    >
                      <CountUp
                        to={stat.value}
                        start={entered}
                        className="block font-mono text-4xl font-semibold tracking-tight text-white tabular-nums transition-[text-shadow] duration-300 group-hover:[text-shadow:0_0_24px_rgba(255,42,61,0.7)]"
                      />
                      <span className="mt-1 block text-[0.7rem] tracking-[0.18em] text-stitch uppercase">{stat.label}</span>
                    </Tile>
                  );
                })}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.div>

      <motion.a
        href="#laporan"
        aria-label="Scroll ke laporan"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-stitch/70 transition-colors hover:text-white"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1, y: [0, 6, 0] } : undefined}
        transition={{ opacity: { delay: 2.4, duration: 1 }, y: { repeat: Infinity, duration: 2.2, ease: "easeInOut" } }}
      >
        <span className="font-mono text-[0.6rem] tracking-[0.35em] uppercase">scroll</span>
        <ChevronDown className="size-4" />
      </motion.a>
    </section>
  );
}

function FloatingChip({ children, className, delay }: { children: ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      aria-hidden
      className={`glass absolute hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-xs whitespace-nowrap text-white/80 lg:flex ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
