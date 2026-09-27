"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Ember {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: "red" | "white";
  phase: number;
}

/** Slow drifting embers behind everything. One canvas, capped DPR, pauses when hidden. */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    const embers: Ember[] = [];

    const makeEmber = (anywhere: boolean): Ember => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 8,
      vy: -(6 + Math.random() * 22),
      hue: Math.random() < 0.78 ? "red" : "white",
      phase: Math.random() * Math.PI * 2,
    });

    // Pre-rendered glow sprites: one drawImage per ember instead of a gradient per frame.
    const makeSprite = (rgb: string) => {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 32;
      const sctx = sprite.getContext("2d");
      if (sctx) {
        const gradient = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, `rgba(${rgb},1)`);
        gradient.addColorStop(0.25, `rgba(${rgb},0.5)`);
        gradient.addColorStop(1, `rgba(${rgb},0)`);
        sctx.fillStyle = gradient;
        sctx.fillRect(0, 0, 32, 32);
      }
      return sprite;
    };
    const sprites = { red: makeSprite("255,42,61"), white: makeSprite("244,242,243") };

    // Mobile URL bars fire resize constantly; only reseed when the ember budget changes.
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(80, (width * height) / 16000) * (reduceMotion ? 0.4 : 1));
      if (target > embers.length) {
        embers.push(...Array.from({ length: target - embers.length }, () => makeEmber(true)));
      } else {
        embers.length = target;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let last = performance.now();
    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.phase += dt;
        e.x += (e.vx + Math.sin(e.phase) * 6) * dt;
        e.y += e.vy * dt;
        if (e.y < -10) embers[i] = makeEmber(false);

        const glow = e.r * 5;
        ctx.globalAlpha = 0.45 + Math.sin(e.phase * 2.3) * 0.25;
        ctx.drawImage(sprites[e.hue], e.x - glow, e.y - glow, glow * 2, glow * 2);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70" />;
}
