"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { ASSETS } from "@/lib/assets";

interface AlertStageProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

/** The full-bleed KEP ALERT siren scene, shared by the opening and its replays. */
export function AlertStage({ title, subtitle, children }: AlertStageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className={reduceMotion ? "absolute inset-0" : "absolute -inset-3 animate-shake"}>
        <Image
          src={ASSETS.alertGif}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover opacity-75 brightness-[0.8] saturate-[1.25]"
        />
      </div>

      {/* Siren wash, vignette and scanlines keep the GIF cinematic rather than raw */}
      <div className="absolute inset-0 animate-siren bg-[radial-gradient(ellipse_at_center,rgba(163,16,29,0.55),transparent_70%)] mix-blend-multiply" />
      <div className="absolute inset-0 bg-crimson/25 mix-blend-color" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.9)_85%)]" />
      <div className="scanlines absolute inset-0 opacity-60" />
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          className="eyebrow mb-5 text-white/70"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          ● Siaga satu — #daget
        </motion.p>

        <motion.h1
          className="relative font-sans text-[clamp(3rem,14vw,10rem)] leading-[0.85] font-black tracking-[-0.04em] text-white text-glow"
          initial={{ opacity: 0, scale: 1.4, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {title}
          <span aria-hidden className="absolute inset-0 animate-glitch text-neon/80 mix-blend-screen">
            {title}
          </span>
        </motion.h1>

        <motion.p
          className="mt-5 font-mono text-[0.8rem] font-semibold tracking-[0.3em] text-white/90 uppercase sm:text-base"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
        >
          {subtitle}
        </motion.p>

        {children}
      </div>
    </div>
  );
}
