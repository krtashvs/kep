"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Hash, Trophy } from "lucide-react";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { AchievementsDrawer } from "@/components/eggs/AchievementsDrawer";
import { useRapidTaps } from "@/hooks/useRapidTaps";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { SCENES, SERVER, type SceneId } from "@/lib/content";
import { cn } from "@/lib/utils";

function useActiveScene(): SceneId {
  const [active, setActive] = useState<SceneId>("hero");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as SceneId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SCENES.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

export function ChannelHeader() {
  const { entered } = useExperience();
  const { unlocked, unlock, notify } = useEasterEggs();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const active = useActiveScene();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const onChannelTap = useRapidTaps((streak) => {
    if (streak === 3) {
      unlock("penjaga");
      notify("channel ini tidak pernah tidur.", `#${SERVER.channel}`);
    }
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 border-b hairline bg-void/55 backdrop-blur-xl"
        initial={{ y: "-100%" }}
        animate={{ y: entered ? "0%" : "-100%" }}
        transition={{ duration: 0.9, delay: entered ? 0.6 : 0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <button
            type="button"
            onClick={onChannelTap}
            className="flex items-center gap-1.5 text-[0.95rem] font-semibold text-white select-none"
          >
            <Hash className="size-5 text-stitch" />
            <span>
              {SERVER.channelEmoji}・{SERVER.channel}
            </span>
          </button>

          <nav aria-label="Scene" className="hidden items-center gap-1 md:flex">
            {SCENES.map((scene) => (
              <a
                key={scene.id}
                href={`#${scene.id}`}
                className={cn(
                  "relative rounded-full px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.18em] uppercase transition-colors",
                  active === scene.id ? "text-white" : "text-stitch/60 hover:text-white/80",
                )}
              >
                {active === scene.id && (
                  <motion.span layoutId="scene-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                {scene.label}
              </a>
            ))}
          </nav>

          <div className="flex min-w-[88px] justify-end">
            <AnimatePresence>
              {unlocked.size > 0 && (
                <motion.button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs font-semibold text-white/85 transition-colors hover:border-neon/40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  aria-label="Achievements"
                >
                  <Trophy className="size-3.5 text-kep" />
                  <span className="tabular-nums">
                    {unlocked.size}/{ACHIEVEMENTS.length}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div aria-hidden className="h-px origin-left bg-gradient-to-r from-crimson via-neon to-ember" style={{ scaleX: progress }} />
      </motion.header>

      <AchievementsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
