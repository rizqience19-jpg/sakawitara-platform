export type OpeningStyle = "gerbang" | "amplop" | "lingkar";
export type SceneStyle = "istana" | "joglo" | "sawah";

export type Template = {
  kind: "classic";
  slug: string;
  name: string;
  tagline: string;
  opening: OpeningStyle;
  openingLabel: string;
  /** total durasi animasi opening (ms) sebelum cover dilepas */
  openDuration: number;
  /** jeda sebelum animasi hero dimulai (ms) */
  heroDelay: number;
};

export type SceneTemplate = {
  kind: "scene";
  slug: string;
  name: string;
  tagline: string;
  scene: SceneStyle;
  openingLabel: string;
  /** kapan kartu nama muncul & scroll dibuka (ms sejak tombol ditekan) */
  titleAt: number;
  unlockAt: number;
};

export type AnyTemplate = Template | SceneTemplate;

export const sceneTemplates: SceneTemplate[] = [
  {
    kind: "scene",
    slug: "graha-asri",
    name: "Graha Asri",
    tagline: "Taman istana klasik — 3D Motion",
    scene: "istana",
    openingLabel: "3D Motion · tirai daun & scene bertingkat",
    titleAt: 5300,
    unlockAt: 6100,
  },
  {
    kind: "scene",
    slug: "joglo-tirta",
    name: "Joglo Tirta",
    tagline: "Joglo, air terjun & pegunungan — ilustrasi lukis, 3D Motion",
    scene: "joglo",
    openingLabel: "3D Motion · kamera mundur dari joglo",
    titleAt: 7000,
    unlockAt: 15000,
  },
  {
    kind: "scene",
    slug: "sawah-lestari",
    name: "Sawah Lestari",
    tagline: "Sawah, sungai & danau saat senja — ilustrasi lukis, 3D Motion",
    scene: "sawah",
    openingLabel: "3D Motion · kamera mundur dari sawah",
    titleAt: 7000,
    unlockAt: 15000,
  },
];

export const templates: Template[] = [
  {
    kind: "classic",
    slug: "royal-noir",
    name: "Royal Noir",
    tagline: "Hitam & emas, mewah dan klasik",
    opening: "gerbang",
    openingLabel: "Gerbang terbuka 3D",
    openDuration: 2300,
    heroDelay: 900,
  },
  {
    kind: "classic",
    slug: "blush-letter",
    name: "Blush Letter",
    tagline: "Romantis, lembut, bernuansa surat cinta",
    opening: "amplop",
    openingLabel: "Amplop & segel lilin",
    openDuration: 2700,
    heroDelay: 1900,
  },
  {
    kind: "classic",
    slug: "sage-garden",
    name: "Sage Garden",
    tagline: "Hijau sage, natural dan teduh",
    opening: "lingkar",
    openingLabel: "Iris reveal melingkar",
    openDuration: 1700,
    heroDelay: 500,
  },
];

export const allTemplates: AnyTemplate[] = [...sceneTemplates, ...templates];

export function getTemplate(slug: string): AnyTemplate | undefined {
  return allTemplates.find((t) => t.slug === slug);
}

/** lokasi foto demo */
const D = process.env.NEXT_PUBLIC_DEMO_ASSETS ?? "/demo";

/** Data contoh — nanti diganti data undangan dari Supabase. */
export const sampleWedding = {
  groom: {
    nick: "Raka",
    full: "Raka Pratama Wijaya, S.T.",
    parents: "Putra pertama dari Bapak Hendra Wijaya & Ibu Sri Lestari",
    instagram: "rakapratama",
  },
  bride: {
    nick: "Nadia",
    full: "Nadia Ayu Larasati, S.Psi.",
    parents: "Putri kedua dari Bapak Agus Santoso & Ibu Rina Marlina",
    instagram: "nadialaras",
  },
  dateISO: "2027-02-14T08:00:00+07:00",
  dateLabel: "Minggu, 14 Februari 2027",
  dateShort: "14 . 02 . 2027",
  events: [
    {
      title: "Akad Nikah",
      time: "08.00 – 10.00 WIB",
      place: "Masjid Agung Al-Ikhlas",
      address: "Jl. Merdeka No. 12, Bandung",
      maps: "https://maps.google.com/?q=Masjid+Agung+Bandung",
    },
    {
      title: "Resepsi",
      time: "11.00 – 14.00 WIB",
      place: "Gedung Sabuga",
      address: "Jl. Tamansari No. 73, Bandung",
      maps: "https://maps.google.com/?q=Sabuga+Bandung",
    },
  ],
  story: [
    { year: "2019", title: "Pertama Bertemu", text: "Berawal dari satu kelas organisasi kampus, sapaan sederhana menjadi awal cerita kami." },
    { year: "2023", title: "Menjalin Komitmen", text: "Setelah perjalanan panjang, kami memutuskan untuk melangkah lebih serius bersama." },
    { year: "2026", title: "Lamaran", text: "Dengan restu kedua keluarga, kami resmi bertunangan dan bersiap menuju hari bahagia." },
  ],
  gifts: [
    { bank: "BCA", number: "1234567890", holder: "Raka Pratama Wijaya" },
    { bank: "Mandiri", number: "0987654321", holder: "Nadia Ayu Larasati" },
  ],
  wishes: [
    { name: "Dimas & Keluarga", attend: "Hadir", text: "Selamat menempuh hidup baru! Semoga sakinah, mawaddah, warahmah." },
    { name: "Salsabila", attend: "Hadir", text: "Ikut bahagia banget! Lancar sampai hari H ya kalian." },
    { name: "Om Bambang", attend: "Tidak hadir", text: "Mohon maaf belum bisa hadir, doa terbaik untuk kalian berdua." },
  ],
  /** URL foto (Supabase Storage). null = placeholder. */
  photos: {
    cover: `${D}/cover.webp` as string | null,
    couple: `${D}/couple.webp` as string | null,
    groom: `${D}/groom.webp` as string | null,
    bride: `${D}/bride.webp` as string | null,
    saveDate: null as string | null,
    closing: `${D}/closing.webp` as string | null,
    gallery: ["gallery-1", "gallery-2", "gallery-3", "savedate", "gallery-5", "gallery-6"].map((n) => `${D}/${n}.webp`) as (string | null)[],
    story: [1, 2, 3].map((i) => `${D}/story-${i}.webp`) as (string | null)[],
  },

  dresscode: {
    text: "Kami dengan hormat mengharapkan tamu undangan mengenakan warna-warna berikut untuk hari istimewa kami.",
    colors: ["#8a6a4a", "#d9c6a5", "#f3ece0"],
  },
  liveStream: { text: "Bagi keluarga & sahabat yang berhalangan hadir, saksikan momen kami secara virtual melalui tautan berikut.", url: "https://youtube.com" },
  /** isi URL mp3 untuk mengaktifkan tombol musik */
  musicUrl: null as string | null,
};

export type Wedding = typeof sampleWedding;
