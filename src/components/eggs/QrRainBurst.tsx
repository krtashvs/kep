"use client";

import { useEffect, useState } from "react";
import { Portal } from "@/components/ui/Portal";
import { QrRainCanvas } from "@/components/ui/QrRainCanvas";

/** A short, page-wide QR downpour. Re-mount (via key) to trigger again. */
export function QrRainBurst() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setActive(false), 3200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Portal>
      <div className="pointer-events-none fixed inset-0 z-[70]">
        <QrRainCanvas active={active} density={40} />
      </div>
    </Portal>
  );
}
