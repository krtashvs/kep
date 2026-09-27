"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ACHIEVEMENT_MAP, type Achievement, type AchievementId } from "@/lib/achievements";
import { readStore, writeStore } from "@/lib/storage";
import { AchievementToasts, type ToastItem } from "@/components/eggs/AchievementToasts";
import { KepAlertOverlay } from "@/components/eggs/KepAlertOverlay";
import { QrRainBurst } from "@/components/eggs/QrRainBurst";
import { SecretVault } from "@/components/eggs/SecretVault";
import { SignatureFlash } from "@/components/eggs/SignatureFlash";
import { GlobalEggs } from "@/components/eggs/GlobalEggs";

interface EasterEggState {
  unlocked: ReadonlySet<AchievementId>;
  unlock: (id: AchievementId) => void;
  notify: (body: string, title?: string) => void;
  aura: number;
  addAura: (amount?: number) => void;
  auraMode: boolean;
  enableAuraMode: () => void;
  triggerAlert: () => void;
  rainQr: () => void;
  vaultUnlocked: boolean;
  openVault: () => void;
  flashSignature: () => void;
}

const EasterEggContext = createContext<EasterEggState | null>(null);

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<AchievementId>>(() => new Set());
  const [aura, setAura] = useState(0);
  const [auraMode, setAuraMode] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [rainKey, setRainKey] = useState(0);
  const [signatureKey, setSignatureKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const toastId = useRef(0);

  // Hydrate persisted progress after mount (storage is client-only).
  useEffect(() => {
    setUnlocked(new Set(readStore<AchievementId[]>("achievements", []).filter((id) => id in ACHIEVEMENT_MAP)));
    setAura(readStore("aura", 0));
    setVaultUnlocked(readStore("vault", false));
    setHydrated(true);
  }, []);

  // Persist only after hydration, so the empty initial state never overwrites saved progress.
  useEffect(() => {
    if (hydrated) writeStore("achievements", [...unlocked]);
  }, [hydrated, unlocked]);
  useEffect(() => {
    if (hydrated) writeStore("aura", aura);
  }, [hydrated, aura]);
  useEffect(() => {
    if (hydrated) writeStore("vault", vaultUnlocked);
  }, [hydrated, vaultUnlocked]);

  const pushToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = ++toastId.current;
    setToasts((current) => [...current.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), 4200);
  }, []);

  const unlockedRef = useRef(unlocked);
  unlockedRef.current = unlocked;

  const unlock = useCallback(
    (id: AchievementId) => {
      if (unlockedRef.current.has(id)) return;
      const achievement: Achievement = ACHIEVEMENT_MAP[id];
      unlockedRef.current = new Set(unlockedRef.current).add(id);
      setUnlocked(unlockedRef.current);
      pushToast({ kind: "achievement", title: achievement.title, body: achievement.description, icon: achievement.icon });
    },
    [pushToast],
  );

  const notify = useCallback(
    (body: string, title?: string) => pushToast({ kind: "message", title: title ?? "kep", body }),
    [pushToast],
  );

  const addAura = useCallback((amount = 1) => setAura((value) => value + amount), []);

  useEffect(() => {
    if (aura >= 5) unlock("aura-maxxing");
  }, [aura, unlock]);

  const enableAuraMode = useCallback(() => {
    setAuraMode(true);
    setAura((value) => value + 10);
    unlock("aura-farmer");
  }, [unlock]);

  const triggerAlert = useCallback(() => setAlertOpen(true), []);
  const closeAlert = useCallback(() => setAlertOpen(false), []);
  const closeVault = useCallback(() => setVaultOpen(false), []);
  const rainQr = useCallback(() => setRainKey((key) => key + 1), []);
  const flashSignature = useCallback(() => setSignatureKey((key) => key + 1), []);

  const openVault = useCallback(() => {
    setVaultUnlocked(true);
    unlock("terlihat");
    setVaultOpen(true);
  }, [unlock]);

  const value = useMemo<EasterEggState>(
    () => ({
      unlocked,
      unlock,
      notify,
      aura,
      addAura,
      auraMode,
      enableAuraMode,
      triggerAlert,
      rainQr,
      vaultUnlocked,
      openVault,
      flashSignature,
    }),
    [unlocked, unlock, notify, aura, addAura, auraMode, enableAuraMode, triggerAlert, rainQr, vaultUnlocked, openVault, flashSignature],
  );

  return (
    <EasterEggContext.Provider value={value}>
      {children}
      <GlobalEggs />
      <AchievementToasts toasts={toasts} />
      <KepAlertOverlay open={alertOpen} onClose={closeAlert} />
      {rainKey > 0 && <QrRainBurst key={rainKey} />}
      {signatureKey > 0 && <SignatureFlash key={signatureKey} />}
      <SecretVault open={vaultOpen} onClose={closeVault} />
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs(): EasterEggState {
  const ctx = useContext(EasterEggContext);
  if (!ctx) throw new Error("useEasterEggs must be used inside <EasterEggProvider>");
  return ctx;
}
