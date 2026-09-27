"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface Bubble {
  id: number;
  text: string;
}

/** Discord-ish floating reply that pops above whatever it's attached to. */
export function ChatBubbles({ bubbles }: { bubbles: Bubble[] }) {
  return (
    <div className="pointer-events-none absolute -top-4 left-1/2 z-20 w-0">
      <AnimatePresence>
        {bubbles.map((bubble, i) => (
          <motion.div
            key={bubble.id}
            className="absolute bottom-0 left-0 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -i * 6, scale: 1 }}
            exit={{ opacity: 0, y: -46, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <div className="rounded-2xl rounded-bl-md border border-white/10 bg-discord-2/95 px-4 py-2 shadow-xl backdrop-blur">
              <span className="mr-2 text-xs font-semibold text-kep">kep</span>
              <span className="text-[0.95rem] text-white">{bubble.text}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
