"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, AlertTriangle, Info, Radio, ShieldAlert, Siren, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { INCIDENTS, MONITOR_METRICS, SERVER, type LogLevel } from "@/lib/content";
import { cn, formatClock } from "@/lib/utils";

const LEVEL_STYLES: Record<LogLevel, { icon: LucideIcon; badge: string; dot: string; card: string }> = {
  INFO: {
    icon: Info,
    badge: "border-blurple/50 bg-blurple/15 text-[#9fb2ff]",
    dot: "bg-[#9fb2ff]",
    card: "hover:border-blurple/40",
  },
  WARNING: {
    icon: AlertTriangle,
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    dot: "bg-amber-300",
    card: "hover:border-amber-400/30",
  },
  CRITICAL: {
    icon: ShieldAlert,
    badge: "border-ember/50 bg-ember/10 text-ember",
    dot: "bg-ember",
    card: "hover:border-ember/40",
  },
  ALERT: {
    icon: Siren,
    badge: "border-neon/60 bg-neon/15 text-neon shadow-[0_0_20px_-4px_var(--color-neon)]",
    dot: "bg-neon shadow-[0_0_12px_var(--color-neon)]",
    card: "border-neon/30 bg-neon/[0.04] hover:border-neon/60",
  },
};

function LiveClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(formatClock(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{now ?? "--.--.--"}</span>;
}

/** A jittery activity sparkline that climbs as the report escalates. */
function Sparkline({ level }: { level: number }) {
  const points = Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    const base = 0.12 + t * t * level * 0.8;
    const noise = Math.sin(i * 2.1) * 0.05 + Math.cos(i * 1.3) * 0.04;
    return `${(t * 100).toFixed(1)},${(100 - Math.min(0.96, base + noise) * 100).toFixed(1)}`;
  });
  const path = `M${points.join(" L")}`;

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff2a3d" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff2a3d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${path} L100,100 L0,100 Z`} fill="url(#spark-fill)" animate={{ d: `${path} L100,100 L0,100 Z` }} transition={{ duration: 0.8 }} />
      <motion.path
        d={path}
        fill="none"
        stroke="#ff2a3d"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
        animate={{ d: path }}
        transition={{ duration: 0.8 }}
      />
    </svg>
  );
}

export function IncidentReportScene() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const gaugeWidth = useTransform(progress, (v) => `${Math.max(6, v * 100)}%`);
  const [threat, setThreat] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setThreat(Math.round(v * 10) / 10));

  const threatLabel = threat > 0.85 ? "KRITIS" : threat > 0.55 ? "TINGGI" : threat > 0.25 ? "SEDANG" : "RENDAH";

  return (
    <section id="laporan" className="relative px-4 py-24 sm:py-32">
      <SectionHeading
        index="02"
        eyebrow="Laporan Kejadian"
        title={
          <>
            Sistem mendeteksi <span className="text-neon text-glow">anomali</span>.
          </>
        }
        description="Log otomatis dari server monitoring #daget. Semua kejadian tercatat, tidak ada yang terlewat."
      />

      <motion.div
        className="glass mx-auto max-w-5xl overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Window chrome */}
        <div className="flex items-center justify-between gap-3 border-b hairline px-4 py-3 font-mono text-[0.7rem] text-stitch sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-neon/80" />
              <span className="size-2.5 rounded-full bg-white/15" />
              <span className="size-2.5 rounded-full bg-white/15" />
            </div>
            <span className="truncate">daget-monitor v4.8.8 — {SERVER.channelEmoji}・{SERVER.channel}</span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden sm:inline">
              <LiveClock />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-neon">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-neon opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-neon" />
              </span>
              LIVE
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px]">
          {/* Timeline */}
          <div className="relative px-4 py-8 sm:px-8">
            <div className="scanlines pointer-events-none absolute inset-0 opacity-30" aria-hidden />
            <ol ref={timelineRef} className="relative space-y-6 pl-8 sm:pl-10">
              <span aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-white/[0.07] sm:left-[15px]" />
              <motion.span
                aria-hidden
                className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-gradient-to-b from-blurple via-ember to-neon shadow-[0_0_12px_var(--color-neon)] sm:left-[15px]"
                style={{ scaleY: progress }}
              />
              {INCIDENTS.map((entry, i) => {
                const style = LEVEL_STYLES[entry.level];
                const Icon = style.icon;
                return (
                  <motion.li
                    key={entry.level}
                    className="relative"
                    initial={{ opacity: 0, x: 24, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }}
                  >
                    <span
                      aria-hidden
                      className={cn("absolute top-6 left-[-20.5px] size-2.5 -translate-x-1/2 rounded-full ring-4 ring-ink sm:left-[-24.5px]", style.dot)}
                    />
                    <div className={cn("rounded-2xl border border-white/[0.07] bg-black/30 p-4 transition-colors duration-300 sm:p-5", style.card)}>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem]">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-semibold tracking-wider", style.badge)}>
                          <Icon className="size-3" />[{entry.level}]
                        </span>
                        <span className="text-stitch/70 tabular-nums">{entry.time}</span>
                      </div>
                      <p className={cn("mt-3 text-base text-white sm:text-lg", entry.level === "ALERT" && "font-semibold")}>{entry.message}</p>
                      <p className="mt-1 font-mono text-xs text-stitch/70">{entry.detail}</p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {/* Side panel */}
          <aside className="space-y-6 border-t hairline px-4 py-8 font-mono sm:px-6 lg:border-t-0 lg:border-l">
            <div>
              <div className="flex items-center justify-between text-[0.7rem] tracking-[0.2em] text-stitch uppercase">
                <span className="flex items-center gap-2">
                  <Radio className="size-3.5" /> Threat level
                </span>
                <span className={cn("font-semibold", threat > 0.55 ? "text-neon" : "text-white/80")}>{threatLabel}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-blurple via-ember to-neon" style={{ width: gaugeWidth }} />
              </div>
            </div>

            <div>
              <p className="flex items-center gap-2 text-[0.7rem] tracking-[0.2em] text-stitch uppercase">
                <Activity className="size-3.5" /> Aktivitas channel
              </p>
              <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/30 p-2">
                <Sparkline level={Math.max(0.1, threat)} />
              </div>
            </div>

            <dl className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {MONITOR_METRICS.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-3 lg:flex lg:items-center lg:justify-between">
                  <dt className="text-[0.6rem] tracking-[0.2em] text-stitch uppercase">{metric.label}</dt>
                  <dd className="mt-1 text-lg font-semibold text-white lg:mt-0">{metric.value}</dd>
                </div>
              ))}
            </dl>

            <p className="rounded-xl border border-white/[0.06] bg-black/30 px-3 py-3 text-[0.7rem] leading-relaxed text-stitch">
              <span className="text-white/80">filter:</span> mentions: kep488
              <br />
              <span className="text-white/80">source:</span> {SERVER.name}
            </p>
          </aside>
        </div>
      </motion.div>
    </section>
  );
}
