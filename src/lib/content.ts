/**
 * All copy lives here so scenes stay purely presentational.
 */

export const SERVER = {
  name: "Rizz Academy",
  channel: "daget",
  channelEmoji: "💸",
  status: "Active",
} as const;

export const PROFILE = {
  displayName: "kep",
  username: "kep488",
  role: "Ketum",
  serverTag: "Y/N",
  traits: ["Dermawan", "Beraura", "Nonchalant"],
  stats: [
    { label: "Mutual Friends", value: 69, egg: "nice" },
    { label: "Mutual Servers", value: 20 },
  ],
} as const;

export const OPENING_LINES = [SERVER.name, "Channel Daget", `Status: ${SERVER.status}`] as const;

export type LogLevel = "INFO" | "WARNING" | "CRITICAL" | "ALERT";

export interface IncidentEntry {
  level: LogLevel;
  time: string;
  message: string;
  detail: string;
}

export const INCIDENTS: IncidentEntry[] = [
  {
    level: "INFO",
    time: "16:41:02",
    message: "Bang Kep memasuki channel daget.",
    detail: "presence.update → #💸・daget",
  },
  {
    level: "WARNING",
    time: "16:41:05",
    message: "Atlet mulai bersiap.",
    detail: "typing.start × 347 user",
  },
  {
    level: "CRITICAL",
    time: "16:41:07",
    message: "QR mulai dijejerin.",
    detail: "media.upload › 1.000+ gambar",
  },
  {
    level: "ALERT",
    time: "16:41:09",
    message: "Aktivitas meningkat drastis.",
    detail: "mentions: kep488 › rate limit terlampaui",
  },
];

export const MONITOR_METRICS = [
  { label: "Messages", value: "1.000+" },
  { label: "Media", value: "1.000+" },
  { label: "Links", value: "142" },
] as const;

/** Chat spam that floods the screen in QR Panic Mode. */
export const SPAM_LINES = [
  "QR",
  "qr bang",
  "cek bang 🙏",
  "jejer",
  "QR QR QR",
  "bang kep 🚨",
  "KEP ALERT",
  "tampil",
  "NMID: ID00000000",
  "SATU QR UNTUK SEMUA",
  "izin tampil",
  "🙏🙏🙏",
  "qr in bang",
  "atlet hadir",
  "@kep488",
  "💸💸💸",
] as const;

export type ChoiceKey = "A" | "B" | "C" | "D";

export interface AtletChoice {
  key: ChoiceKey;
  label: string;
  /** What the atlet actually does before the outcome rolls. */
  action: string;
}

export const ATLET_CHOICES: AtletChoice[] = [
  { key: "A", label: "Ngolah", action: "Kamu mulai ngolah kata-kata paling menyentuh hati." },
  { key: "B", label: "Spam QR", action: "QR terkirim. 47 QR lain ikut terkirim bersamaan." },
  { key: "C", label: "Spam KEP ALERT", action: "🚨 KEP ALERT terkirim ke #daget." },
  { key: "D", label: "Tampil", action: "Kamu tampil. Percaya diri. Tanpa ragu." },
];

export type OutcomeKind = "offline" | "seen" | "aura" | "rare";

export const RARE_CHANCE = 0.05;
/** Consecutive "Tampil" picks that guarantee Bang Kep notices. */
export const TAMPIL_STREAK_TARGET = 3;

export const HALL_BADGES = [
  { id: "master", label: "MASTER", caption: "Tingkat tertinggi" },
  { id: "sophomore", label: "SOPHOMORE", caption: "Angkatan legendaris" },
  { id: "nicegang", label: "NICEGANG", caption: "Selalu berbagi" },
] as const;

export const HALL_QUOTES = [
  "Sebagian orang datang untuk meminta.",
  "Sebagian datang untuk bercanda.",
  "Tapi ada juga yang datang untuk berbagi.",
] as const;

export const SCENES = [
  { id: "hero", label: "Profil" },
  { id: "laporan", label: "Laporan" },
  { id: "panic", label: "QR Panic" },
  { id: "simulator", label: "Simulator" },
  { id: "hall", label: "Hall" },
  { id: "ending", label: "W" },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];
