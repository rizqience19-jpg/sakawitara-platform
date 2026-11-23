import type { Invitation, Rsvp } from "./types";

// Data contoh untuk /u/contoh, agar desain bisa dilihat tanpa database.
export const DEMO_INVITATION: Invitation = {
  id: "demo",
  slug: "contoh",
  groom_name: "Raka",
  groom_full_name: "Raden Raka Wicaksana, S.T.",
  groom_parents: "Bapak Hadi Wicaksono & Ibu Sri Lestari",
  bride_name: "Ayu",
  bride_full_name: "Rr. Ayu Kusumawardani, S.Pd.",
  bride_parents: "Bapak Bambang Suryadi & Ibu Endang Rahayu",
  akad_at: "2027-06-12T08:00:00+07:00",
  akad_venue: "Masjid Gedhe Kauman",
  akad_address: "Jl. Kauman, Ngupasan, Yogyakarta",
  resepsi_at: "2027-06-12T11:00:00+07:00",
  resepsi_venue: "Pendopo Ndalem Sakawitara",
  resepsi_address: "Jl. Rotowijayan No. 1, Kadipaten, Yogyakarta",
  maps_url: "https://maps.google.com/?q=Kraton+Yogyakarta",
  quote:
    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya. — QS. Ar-Rum: 21",
  created_at: "2026-11-01T00:00:00+07:00",
};

export const DEMO_RSVPS: Rsvp[] = [
  { id: "d1", invitation_id: "demo", name: "Pakdhe Joko", attendance: "hadir", guests: 2, message: "Mugi dados keluarga ingkang sakinah, mawaddah, warahmah.", created_at: "2026-11-20T10:00:00+07:00" },
  { id: "d2", invitation_id: "demo", name: "Dewi & keluarga", attendance: "hadir", guests: 3, message: "Selamat menempuh hidup baru, Raka & Ayu!", created_at: "2026-11-19T09:00:00+07:00" },
];
