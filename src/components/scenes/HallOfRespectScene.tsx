"use client";

import { motion } from "framer-motion";
import { Crown, GraduationCap, HandHeart, type LucideIcon } from "lucide-react";
import { KepAvatar } from "@/components/ui/KepAvatar";
import { HALL_BADGES, HALL_QUOTES, PROFILE, SERVER } from "@/lib/content";
import { cn } from "@/lib/utils";

const BADGE_ICONS: Record<(typeof HALL_BADGES)[number]["id"], LucideIcon> = {
  master: Crown,
  sophomore: GraduationCap,
  nicegang: HandHeart,
};

const EASE = [0.16, 1, 0.3, 1] as const;
const RING_TEXT = `${SERVER.name} · Hall of Respect · ${PROFILE.role} · `.toUpperCase();

function OrbitText() {
  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 size-full animate-spin-slow [animation-duration:40s]" aria-hidden>
      <defs>
        <path id="orbit" d="M150,150 m-128,0 a128,128 0 1,1 256,0 a128,128 0 1,1 -256,0" />
      </defs>
      <text className="fill-stitch/50 font-mono text-[10.5px] tracking-[0.32em]">
        <textPath href="#orbit">{RING_TEXT.repeat(2)}</textPath>
      </text>
    </svg>
  );
}

export function HallOfRespectScene() {
  return (
    <section id="hall" className="relative overflow-clip px-4 py-28 sm:py-36">
      {/* Spotlight from above */}
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 h-[80%] w-[min(900px,140vw)] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_0%,transparent_155deg,rgba(255,255,255,0.07)_172deg,rgba(255,255,255,0.1)_180deg,rgba(255,255,255,0.07)_188deg,transparent_205deg)] blur-md" />

      <motion.p
        className="eyebrow relative text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <span className="text-neon">05</span> — Hall of Respect
      </motion.p>

      <motion.article
        className="relative mx-auto mt-10 max-w-3xl rounded-[32px] border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent px-6 pt-12 pb-10 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:px-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: EASE }}
      >
        <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative mx-auto grid size-[260px] place-items-center sm:size-[300px]">
          <OrbitText />
          <KepAvatar size={170} heat={0.25} ring={false} className="shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_0_10px_rgba(255,255,255,0.02)]" />
        </div>

        <p className="eyebrow mt-4">Inductee · 2026</p>
        <h2 className="mt-3 font-serif text-[clamp(3rem,10vw,5rem)] leading-none text-white">{PROFILE.displayName}</h2>
        <p className="mt-2 text-sm text-stitch">
          {PROFILE.role} · {SERVER.name}
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {HALL_BADGES.map((badge, i) => {
            const Icon = BADGE_ICONS[badge.id];
            return (
              <motion.li
                key={badge.id}
                className="group relative w-[calc(50%-0.375rem)] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.01] px-4 py-4 sm:w-44"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: EASE }}
              >
                <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                <Icon className={cn("mx-auto size-5", badge.id === "master" ? "text-neon" : "text-white/80")} />
                <p className="mt-2 font-mono text-xs font-semibold tracking-[0.3em] text-white">{badge.label}</p>
                <p className="mt-1 text-[0.7rem] text-stitch">{badge.caption}</p>
              </motion.li>
            );
          })}
        </ul>

        <div className="mx-auto mt-14 max-w-xl space-y-5">
          {HALL_QUOTES.map((quote, i) => {
            const last = i === HALL_QUOTES.length - 1;
            return (
              <motion.p
                key={quote}
                className={cn(
                  "font-serif text-[clamp(1.35rem,4.2vw,2rem)] leading-snug italic",
                  last ? "text-white" : "text-stitch/80",
                )}
                initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 1 }}
                transition={{ delay: i * 0.9, duration: 1.4, ease: EASE }}
              >
                “{quote}”
                {last && (
                  <motion.span
                    aria-hidden
                    className="mx-auto mt-3 block h-px w-24 bg-gradient-to-r from-transparent via-neon to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.9 + 1, duration: 1.2 }}
                  />
                )}
              </motion.p>
            );
          })}
        </div>
      </motion.article>
    </section>
  );
}
