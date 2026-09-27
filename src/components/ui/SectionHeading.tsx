"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ index, eyebrow, title, description, align = "center", className }: SectionHeadingProps) {
  return (
    <motion.header
      className={cn("mb-10 sm:mb-14", align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="text-neon">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[clamp(2rem,6vw,3.5rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-white">{title}</h2>
      {description && <p className="mt-4 text-[0.95rem] leading-relaxed text-stitch">{description}</p>}
    </motion.header>
  );
}
