"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QrRainCanvasProps {
  active: boolean;
  /** Roughly how many drops spawn per second on a 1000px-wide screen. */
  density?: number;
  className?: string;
}

type Drop =
  | { kind: "sprite"; x: number; y: number; vy: number; rot: number; vr: number; size: number; sprite: HTMLCanvasElement; alpha: number }
  | { kind: "text"; x: number; y: number; vy: number; rot: number; vr: number; size: number; text: string; color: string; alpha: number };

const WORDS = ["QR", "QR", "QR", "qr", "jejer", "QR?", "cek", "💸"];
const TEXT_COLORS = ["#ff2a3d", "#ff6b5a", "#f4f2f3", "#9aa0b8"];

/**
 * A dummy, non-scannable QR-looking sprite: three finder squares plus noise.
 * Rendered once to an offscreen canvas so each frame is just a drawImage.
 */
function createQrSprite(px: number, color: string, glow: boolean): HTMLCanvasElement {
  const modules = 21;
  const cell = Math.max(1, Math.floor(px / modules));
  const size = cell * modules;
  const pad = glow ? 10 : 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size + pad * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.translate(pad, pad);
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
  }
  ctx.fillStyle = color;

  const finder = (fx: number, fy: number) => {
    ctx.fillRect(fx * cell, fy * cell, 7 * cell, 7 * cell);
    ctx.clearRect((fx + 1) * cell, (fy + 1) * cell, 5 * cell, 5 * cell);
    ctx.fillRect((fx + 2) * cell, (fy + 2) * cell, 3 * cell, 3 * cell);
  };
  finder(0, 0);
  finder(modules - 7, 0);
  finder(0, modules - 7);

  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const inFinder = (x < 8 && y < 8) || (x > modules - 9 && y < 8) || (x < 8 && y > modules - 9);
      if (!inFinder && Math.random() > 0.52) ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  return canvas;
}

export function QrRainCanvas({ active, density = 26, className }: QrRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const startRef = useRef<() => void>(() => {});
  const reduceMotion = useReducedMotion();
  activeRef.current = active;

  // The loop idles once the sky is empty; wake it when rain is switched back on.
  useEffect(() => {
    if (active) startRef.current();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const sprites = [
      createQrSprite(42, "#ff2a3d", true),
      createQrSprite(42, "#f4f2f3", false),
      createQrSprite(63, "#ff2a3d", true),
      createQrSprite(28, "#9aa0b8", false),
      createQrSprite(84, "#a3101d", true),
    ];

    const drops: Drop[] = [];
    const rate = (reduceMotion ? density * 0.25 : density) / 1000;
    let spawnBudget = 0;
    let visible = true;
    let frame = 0;
    let last = performance.now();

    const spawn = () => {
      const base = { x: Math.random() * width, y: -80, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 1.6, alpha: 0.35 + Math.random() * 0.65 };
      if (Math.random() < 0.45) {
        const sprite = sprites[Math.floor(Math.random() * sprites.length)];
        drops.push({ ...base, kind: "sprite", sprite, size: sprite.width * (0.55 + Math.random() * 0.6), vy: 90 + Math.random() * 220 });
      } else {
        drops.push({
          ...base,
          kind: "text",
          text: WORDS[Math.floor(Math.random() * WORDS.length)],
          color: TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)],
          size: 12 + Math.random() * 30,
          vy: 120 + Math.random() * 260,
          vr: (Math.random() - 0.5) * 0.8,
        });
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (activeRef.current && drops.length < 220) {
        spawnBudget += rate * width * dt;
        while (spawnBudget >= 1) {
          spawn();
          spawnBudget -= 1;
        }
      }

      ctx.clearRect(0, 0, width, height);
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.vy * dt;
        d.rot += d.vr * dt;
        if (d.y > height + 100) {
          drops.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        if (d.kind === "sprite") {
          ctx.drawImage(d.sprite, -d.size / 2, -d.size / 2, d.size, d.size);
        } else {
          ctx.font = `700 ${d.size}px ui-monospace, SFMono-Regular, monospace`;
          ctx.fillStyle = d.color;
          ctx.fillText(d.text, 0, 0);
        }
        ctx.restore();
      }

      if (visible && (activeRef.current || drops.length > 0)) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const start = () => {
      if (frame || !visible) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    intersection.observe(canvas);

    startRef.current = start;
    start();

    return () => {
      cancelAnimationFrame(frame);
      startRef.current = () => {};
      intersection.disconnect();
      resizeObserver.disconnect();
    };
  }, [density, reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none h-full w-full", className)} />;
}
