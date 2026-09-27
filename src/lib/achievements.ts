export type AchievementId =
  | "cek"
  | "jejerin"
  | "alarm"
  | "didengar"
  | "hujan"
  | "aura-farmer"
  | "nice"
  | "penjaga"
  | "balik-lagi"
  | "sabar"
  | "atlet-sejati"
  | "aura-maxxing"
  | "www"
  | "sampai-akhir"
  | "terlihat"
  | "bayangan";

export interface Achievement {
  id: AchievementId;
  title: string;
  /** Shown only after unlocking — never a hint. */
  description: string;
  icon: string;
  secret?: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "cek", title: "Dicek", description: "Menyentuh avatar sang Ketum.", icon: "👆" },
  { id: "jejerin", title: "Dijejerin", description: "Klik terus sampai disuruh jejerin.", icon: "📥" },
  { id: "alarm", title: "Alarm Palsu", description: "Membunyikan KEP ALERT tanpa izin.", icon: "🚨" },
  { id: "didengar", title: "Didengar", description: "Mengetik “cek” langsung dari keyboard.", icon: "⌨️" },
  { id: "hujan", title: "Musim Hujan QR", description: "Mengetik “jejerin” dan menurunkan hujan.", icon: "🌧️" },
  { id: "aura-farmer", title: "Aura Farmer", description: "Konami code. Aura naik drastis.", icon: "🎮" },
  { id: "nice", title: "Nice.", description: "Mengecek angka mutual friends.", icon: "😏" },
  { id: "penjaga", title: "Penjaga Channel", description: "Mengetuk header #daget berkali-kali.", icon: "#️⃣" },
  { id: "balik-lagi", title: "Balik Lagi", description: "Pergi dari tab, lalu kembali.", icon: "↩️" },
  { id: "sabar", title: "Menunggu Daget", description: "Diam 45 detik. Sabar adalah kunci.", icon: "⏳" },
  { id: "atlet-sejati", title: "Atlet Serba Bisa", description: "Mencoba semua langkah di simulator.", icon: "🏅" },
  { id: "aura-maxxing", title: "Aura Maxxing", description: "Mengumpulkan 5 aura.", icon: "✨" },
  { id: "www", title: "WWWW", description: "Mengetik “www”. W untuk Ketum.", icon: "🇼" },
  { id: "sampai-akhir", title: "Sampai Akhir", description: "Menemukan titik terakhir.", icon: "•" },
  {
    id: "terlihat",
    title: "Atlet Terlihat",
    description: "Bang Kep melihatmu. Brankas terbuka.",
    icon: "👁️",
    secret: true,
  },
  {
    id: "bayangan",
    title: "Bayangan",
    description: "Menemukan sesuatu yang tidak seharusnya terlihat.",
    icon: "🕶️",
    secret: true,
  },
];

export const ACHIEVEMENT_MAP: Record<AchievementId, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
) as Record<AchievementId, Achievement>;
