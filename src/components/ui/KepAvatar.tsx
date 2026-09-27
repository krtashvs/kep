"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/assets";

interface KepAvatarProps {
  /** Intrinsic pixel size; also the rendered size unless `className` sets one. */
  size: number;
  /** Let `className` drive the dimensions (e.g. responsive sizes). */
  fluid?: boolean;
  /** 0–1: how hot the red halo burns. */
  heat?: number;
  ring?: boolean;
  status?: "dnd" | "offline" | null;
  priority?: boolean;
  className?: string;
  onPress?: () => void;
  label?: string;
}

export function KepAvatar({ size, fluid = false, heat = 0.4, ring = true, status = null, priority, className, onPress, label = "Avatar Bang Kep" }: KepAvatarProps) {
  const Wrapper = onPress ? motion.button : motion.div;

  return (
    <Wrapper
      type={onPress ? "button" : undefined}
      onClick={onPress}
      aria-label={onPress ? label : undefined}
      className={cn("relative isolate shrink-0 rounded-full select-none", onPress && "cursor-pointer focus-visible:outline-none", className)}
      style={fluid ? undefined : { width: size, height: size }}
      whileHover={onPress ? { scale: 1.03 } : undefined}
      whileTap={onPress ? { scale: 0.94 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {/* Soft halo */}
      <motion.span
        aria-hidden
        className="absolute -inset-[18%] -z-10 rounded-full bg-[radial-gradient(circle,var(--color-neon)_0%,var(--color-crimson)_35%,transparent_70%)] blur-2xl"
        animate={{ opacity: 0.25 + heat * 0.6, scale: 1 + heat * 0.12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {ring && (
        <span
          aria-hidden
          className="absolute -inset-[5px] -z-10 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-neon)_70deg,transparent_140deg,rgba(57,79,147,0.8)_220deg,transparent_300deg)] opacity-90"
        />
      )}
      <span aria-hidden className="absolute -inset-[2px] -z-10 rounded-full bg-void" />
      <Image
        src={ASSETS.avatar}
        alt={onPress ? "" : label}
        width={size}
        height={size}
        priority={priority}
        draggable={false}
        className="size-full rounded-full object-cover"
      />
      {status && (
        <span
          aria-hidden
          className="absolute right-[3%] bottom-[3%] grid size-[22%] min-h-3.5 min-w-3.5 place-items-center rounded-full bg-void"
        >
          {status === "dnd" ? (
            <span className="relative block h-[62%] w-[62%] rounded-full bg-neon shadow-[0_0_10px_var(--color-neon)]">
              <span className="absolute top-1/2 left-1/2 h-[22%] w-[60%] -translate-1/2 rounded-full bg-void" />
            </span>
          ) : (
            <span className="block h-[62%] w-[62%] rounded-full border-[3px] border-stitch/70" />
          )}
        </span>
      )}
    </Wrapper>
  );
}
