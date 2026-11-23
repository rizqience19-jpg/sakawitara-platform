# Panduan Gaya Animasi Cerita Desa

Patokan untuk setiap cerita baru. Contoh lengkapnya: `sumur-mbah-darmi.html` + `narasi-gunawan.mp3`.

## 1. Format video

- Tegak **9:16**, render **Full HD 1080×1920, 30 fps, CRF 16** (kanvas kerja 450×800).
- Durasi **± 1,5–2 menit**, **30–40 baris** naskah.
- **Satu baris naskah = satu adegan.** Ganti adegan tiap 1–4 detik (potongan cepat ala TikTok).
- Penutup: layar gelap transparan + **"Tamat"** (Georgia italic) + satu ajakan singkat.

## 2. Pola cerita

Misteri desa → digosipkan warga → tokoh muda penasaran menyelidiki diam-diam (biasanya malam hari) → ketahuan → **"Ternyata..."** → penjelasan ilmiah (adegan *zoom* ke dalam: tanah, akar, sel, dsb.) → warga ikut mencontoh → kalimat penutup yang menyimpulkan.

Nada: santai, lucu, sedikit dramatis; edukasinya jelas dan benar. Tokoh, nama, dan tempat **selalu karangan sendiri**, bukan meniru kreator lain.

## 3. Gaya visual

- **Tokoh**: kepala bulat besar dengan gradasi, mata oval besar berkedip, alis ekspresif, badan kotak membulat, kaki-tangan garis. Fungsi `person()`.
  - Ekspresi (`mood`): `calm`, `happy` (pipi merah), `wow` (mata besar, mulut terbuka), `scared` (keringat menetes), `laugh` (mata terpejam, mulut lebar), `shy`, `frown`, `suspicious`.
  - Mulut bergerak saat narator bicara (`talk:true`).
  - Pegangan (`tools`): `linggis`, `bucket`, `leaves`, `jerry`.
- **Tokoh yang sudah ada**: Mbah Darmi (kebaya, kerudung coklat), Slamet (kaos biru), Pak Kardi (peci, kumis), warga `aunt`, `white`, `neighbor`.
- **Suasana** (`fields(t, mode)`): `day`, `dry` (kemarau, tanah retak), `night` (purnama, bintang), `dusk` (senja).
- **Properti**: rumah, pohon, sawah, sumur + timba, warung (Warung Mbak Sri), pagar bambu, pohon pisang, lubang, gelembung pikiran, hujan, cacing.
- **Kamera**: tiap adegan punya zoom awal → akhir + titik fokus, gerak halus (*ease*), sedikit goyang horizontal.
- **Caption**: **satu kata** sesuai ucapan, tebal putih dengan garis hitam, di tengah agak bawah (y ≈ 580 dari 800). Tanda kutip & titik di akhir kata dibuang.
- **Warna**: palet berani, jangan pastel. Kemarau = langit biru → cakrawala jingga + tanah oranye; malam = biru tua pekat; siang = hijau segar. Tokoh punya garis tepi tipis coklat tua. Di akhir tiap bingkai ada koreksi warna `grade()` (saturasi 1,18, kontras 1,1, vignette 0,3) sebelum caption.
- **Label edukasi**: pil krem kecil (`pill()`), misalnya "AIR HUJAN", "BIOPORI".

## 4. Gaya voice over

- **Layanan**: ElevenLabs (konektor MCP di Claude).
- **Suara**: **Gunawan – Warm Storyteller**, `voice_id: Bg6KNp66MkNAZdWJECjU` (pria, akhir 20-an, santai, hangat, seperti bercerita ke teman).
- **Model**: `eleven_v4` (mendukung tag ekspresi).
- **Teks**: seluruh naskah dalam satu kali generate; **`[pause]` di antara setiap baris** (wajib — dipakai untuk mencocokkan adegan).
- **Tag ekspresi** diletakkan di awal baris yang nadanya berubah:
  - pembuka / hangat: `[warmly]`
  - misteri: `[mysteriously]`, gosip: `[mischievously]`, `[whispers]`
  - penasaran: `[curious]`, malam/klimaks: `[dramatically]`, takut: `[nervous]`, hati-hati: `[cautiously]`
  - aksi: `[excited]`, teriakan tokoh: `[shouting]`
  - lucu: `[chuckles]`, `[laughs]`, kaget: `[surprised]`
  - suara orang tua: `[elderly voice] [warmly]`
  - penutup: `[softly]`
  - "Ternyata..." selalu `[dramatically]`.
- **Dialog tokoh** ditulis dalam tanda kutip, tetap dibacakan narator yang sama.
- **Biaya**: ± 2.400 kredit per versi untuk naskah ± 1.700 karakter (default 2 versi ≈ 4.800). Cek dulu dengan `estimate_only`.
- Hasil: ± 15–18 huruf per detik; jeda `[pause]` ± 0,3–0,7 detik.

## 5. Alur kerja cerita baru

1. Tulis naskah (`naskah-<judul>.md`): tabel nomor, narasi, adegan. Minta persetujuan pengguna.
2. Salin `sumur-mbah-darmi.html` → `<judul>.html`; ganti `SCRIPT` (teks + kunci adegan + kamera) dan tambah adegan/properti baru di `paintScene()`. Set `const TIMES=null;`.
3. Render preview tanpa suara: `node animasi/render.js animasi/output/<judul>-preview.mp4 "" 540 30`; cek satu bingkai per adegan.
4. Buat suara di ElevenLabs (pengaturan di bagian 4). Unduh hasilnya (host `elevenlabsusercontent.com` harus diizinkan — environment **sakawitara-platform** sudah mengizinkannya).
5. Cocokkan waktu: `silencedetect` (`noise=-38dB`, `d=0.12`), pilih jeda yang paling sesuai dengan panjang tiap baris, lalu periksa baris dengan kecepatan janggal (< 10 atau > 22 huruf/detik) dan perbaiki manual. Isi `TIMES`.
6. Render final: `node animasi/render.js animasi/output/<judul>.mp4 animasi/<narasi>.mp3 1080 30`; cek beberapa bingkai bahwa caption sesuai kata.
7. Musik latar & efek suara ditambahkan pengguna sendiri (CapCut).
