"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface ExperienceState {
  /** True once the visitor pressed MASUK on the opening alarm. */
  entered: boolean;
  enter: () => void;
  replayOpening: () => void;
}

const ExperienceContext = createContext<ExperienceState | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [entered, setEntered] = useState(false);

  const enter = useCallback(() => setEntered(true), []);
  const replayOpening = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setEntered(false);
  }, []);

  const value = useMemo(() => ({ entered, enter, replayOpening }), [entered, enter, replayOpening]);

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience(): ExperienceState {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}
