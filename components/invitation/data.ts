export type OpeningStyle = "gerbang" | "amplop" | "lingkar";

export type Template = {
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

export const templates: Template[] = [
  {
    slug: "royal-noir",
    name: "Royal Noir",
    tagline: "Hitam & emas, mewah dan klasik",
    opening: "gerbang",
    openingLabel: "Gerbang terbuka 3D",
    openDuration: 2300,
    heroDelay: 900,
  },
  {
    slug: "blush-letter",
    name: "Blush Letter",
    tagline: "Romantis, lembut, bernuansa surat cinta",
    opening: "amplop",
    openingLabel: "Amplop & segel lilin",
    openDuration: 2700,
    heroDelay: 1900,
  },
  {
    slug: "sage-garden",
    name: "Sage Garden",
    tagline: "Hijau sage, natural dan teduh",
    opening: "lingkar",
    openingLabel: "Iris reveal melingkar",
    openDuration: 1700,
    heroDelay: 500,
  },
];

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}

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
  /** isi URL mp3 untuk mengaktifkan tombol musik */
  musicUrl: null as string | null,
};

export type Wedding = typeof sampleWedding;
