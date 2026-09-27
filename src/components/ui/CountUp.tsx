"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  /** Hold the count until the parent says go (e.g. after the opening). */
  start?: boolean;
  className?: string;
}

export function CountUp({ to, duration = 2.2, start = true, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || !start) return;
    if (reduceMotion) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, start, to, duration, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      {value}
    </span>
  );
}
