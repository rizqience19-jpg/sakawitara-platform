# sakawitara-platform

- Next.js 15 + Supabase: platform undangan pernikahan digital bertema Jawa (`app/`, `lib/`, `supabase/schema.sql`).
- `animasi/`: video cerita kartun desa (canvas 2D → MP4). **Sebelum membuat cerita/animasi baru, baca `animasi/PANDUAN-GAYA.md`** — berisi gaya visual, gaya voice over ElevenLabs (suara, model, tag), dan alur kerjanya.
- `animasi/hantu/`: kanal **Mesin Pengumuman** (maskot speaker kuning bermuka datar, tombol merah di kepala, ekor kabel), episode "Hantu Kena Sensor". Build: `python3 animasi/hantu/sfx.py && node animasi/hantu/build.js`. Suara dialog ElevenLabs disimpan di `animasi/hantu/suara/`.
