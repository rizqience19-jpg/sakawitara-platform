# sakawitara-platform

- Next.js 15 + Supabase: platform undangan pernikahan digital bertema Jawa (`app/`, `lib/`, `supabase/schema.sql`).
- `animasi/`: video cerita kartun desa (canvas 2D → MP4). **Sebelum membuat cerita/animasi baru, baca `animasi/PANDUAN-GAYA.md`** — berisi gaya visual, gaya voice over ElevenLabs (suara, model, tag), dan alur kerjanya.
- `animasi/hantu/`: kanal **Mesin Pengumuman** (maskot speaker kuning bermuka datar, tombol merah di kepala, ekor kabel), episode "Hantu Kena Sensor". Build: `python3 animasi/hantu/sfx.py && node animasi/hantu/build.js`. Suara dialog ElevenLabs disimpan di `animasi/hantu/suara/`.
- `animasi/lampu-merah/`: "Konser di Lampu Merah" (gaya Mbah Darmi, ±2 menit). Build: `python3 animasi/lampu-merah/sfx.py && node animasi/lampu-merah/build.js`. Waktu kata diambil dari transkripsi ElevenLabs (`suara/narasi-words.json`); narasi dipotong per baris lalu ditata ulang dengan jeda komedi (kolom ke-7 di `SCRIPT`).
