"use client";

import { useEffect } from "react";
import { useEasterEggs } from "@/components/providers/EasterEggProvider";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useKeySequences } from "@/hooks/useKeySequences";

const KONAMI = "↑↑↓↓←→←→ba";
const IDLE_MS = 45_000;
const AWAY_TITLE = "🚨 KEP ALERT";
const BACK_TITLE = "cek";

/** Page-wide listeners: secret keywords, tab switching, idling, the console. */
export function GlobalEggs() {
  const { unlock, notify, rainQr, enableAuraMode, triggerAlert } = useEasterEggs();
  const { entered } = useExperience();

  useKeySequences({
    [KONAMI]: () => {
      enableAuraMode();
      notify("aura lu naik drastis.", "kep");
    },
    jejerin: () => {
      rainQr();
      unlock("hujan");
    },
    www: () => {
      unlock("www");
      notify("W", "kep");
    },
    cek: () => {
      unlock("didengar");
      notify("cek");
    },
    alert: () => triggerAlert(),
  });

  // Discord-style tab title: the channel pings you while you're away.
  useEffect(() => {
    const original = document.title;
    let restore = 0;
    const onVisibility = () => {
      window.clearTimeout(restore);
      if (document.hidden) {
        document.title = AWAY_TITLE;
      } else {
        document.title = BACK_TITLE;
        unlock("balik-lagi");
        restore = window.setTimeout(() => (document.title = original), 1600);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(restore);
      document.removeEventListener("visibilitychange", onVisibility);
      document.title = original;
    };
  }, [unlock]);

  // Sit still long enough and Bang Kep "reads" your message.
  useEffect(() => {
    if (!entered) return;
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        notify("…", "kep");
        unlock("sabar");
      }, IDLE_MS);
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((event) => window.addEventListener(event, arm, { passive: true }));
    arm();
    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, arm));
    };
  }, [entered, notify, unlock]);

  useEffect(() => {
    console.log(
      "%ccek",
      "font: 900 64px system-ui; color: #ff2a3d; text-shadow: 0 0 24px #ff2a3d;",
    );
    console.log(
      "%cAtlet yang baik membaca console. Atlet yang hebat… tampil.",
      "font: 12px ui-monospace, monospace; color: #9aa0b8;",
    );
  }, []);

  return null;
}
