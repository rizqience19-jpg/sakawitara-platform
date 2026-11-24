# Panduan Gaya Animasi Cerita Desa

Patokan untuk setiap cerita baru. Contoh lengkapnya: `sumur-mbah-darmi.html` + `narasi-gunawan.mp3`.

## 1. Format video

- Tegak **9:16**, render **Full HD 1080×1920, 30 fps, CRF 16** (kanvas kerja 450×800).
- Durasi **± 1,5–2 menit**, **30–40 baris** naskah.
- **Satu baris naskah = satu adegan.** Ganti adegan tiap 1–4 detik (potongan cepat ala TikTok).
- **Judul di awal (wajib)**: tampil ± 2,5 detik di atas adegan pertama (tidak menambah durasi). Baris kecil = nama seri/kanal bila ada (mis. "Kisah Nyempil"), baris besar = judul episode. Pakai judul yang ditulis pengguna.
- **Penutup (wajib)**: layar gelap transparan, **tanpa tulisan "Tamat"**. Isinya dua baris dengan **gaya huruf caption** (800 system-ui, putih, garis hitam tebal — sama seperti `caption()`):
  - "Sampai jumpa di Kisah Nyempil berikutnya" (besar, boleh dua baris)
  - "@kisah.nyempil" (lebih kecil, di bawahnya)

## 1a. Aturan tetap (dari masukan pengguna)

- **Tanpa musik latar.** Jangan menambah musik apa pun kecuali pengguna memintanya; musik ditambahkan pengguna sendiri.
- **Narasi diputar UTUH, persis seperti Mbah Darmi.** Jangan memotong narasi per baris, jangan menyisipkan jeda buatan di antara potongan, dan jangan mengubah tempo (`atempo`) — hasilnya terdengar terbata-bata. Jeda komedi dibuat oleh narator sendiri lewat `[pause]`/`[long pause]` di teks ElevenLabs. Adegan dan caption yang menyesuaikan waktu narasi (pakai transkripsi per kata), bukan sebaliknya. Kalau terlalu panjang, perpendek naskahnya.
- **Efek suara DIPAKAI, musik mengalir TIDAK.** Pakai efek suara pendek untuk momen penting (ayam berkokok, "teng!", "jreng" saat twist, langkah, ketukan, dsb.), tapi jangan ada musik latar yang terus mengalir. Efek suara harus jauh lebih pelan dari narasi (± −18 dB di bawah suara narator) dan tidak boleh menimpa kata yang sedang diucapkan; letakkan di jeda atau di awal/akhir kalimat.
- **Satu patokan ukuran tokoh.** Semua orang dewasa memakai skala yang sama dalam satu adegan dan antaradegan pada jarak yang sama; anak-anak lebih kecil secara konsisten. Kendaraan dan properti mengikuti ukuran orang, bukan sebaliknya:
  - tinggi orang dewasa ± setinggi atap kabin mobil/pikap; kepala tokoh di dalam kendaraan sama besar dengan kepala tokoh yang berdiri di sebelahnya;
  - kalau tokoh tidak muat di jendela/kendaraan, **perbesar kendaraannya**, jangan kecilkan tokohnya;
  - perbedaan ukuran hanya boleh karena jarak (perspektif), dan harus terlihat jelas sebagai jauh/dekat.
- Cek ukuran sebelum render: buat satu bingkai per adegan dan bandingkan tinggi kepala antartokoh.
- **Benda tidak bergerak sendiri.** Setiap benda yang berpindah (toples, gelas, bola, dsb.) harus dibawa tangan: tangan menjangkau benda dulu, baru benda ikut tangan; saat diletakkan, tangan membawanya sampai ke tempatnya lalu kembali. Benda yang tidak dipegang tetap diam di tempat terakhirnya (meja, pangkuan, lantai) — tidak boleh menghilang atau muncul tiba-tiba antaradegan. Cek dengan beberapa bingkai berurutan dalam satu adegan.

## 1b. Aturan tambahan (masukan pengguna, November 2026)

- **Volume harus kencang**: target loudness ± **-14 LUFS** (standar TikTok/IG/YouTube). Di `build.js`, rantai audio setelah `amix`: `volume=2.4,acompressor=threshold=-20dB:ratio=3:attack=5:release=150,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=44100,alimiter=limit=0.9`. Cek dengan `ffmpeg -i <audio.wav> -af ebur128=peak=true -f null -` (I ≈ -13 s/d -14 LUFS, puncak ≤ -0,5 dBFS).
- **Cerita bersambung**: bagian pertama **tidak** diberi tulisan "Bagian 1" di judul — biar mengalir. Bagian berikutnya boleh "Bagian 2", dst.
- **Dekorasi dalam ruangan harus ramai** dan terlihat di dalam bingkai kamera (bukan di luar zoom): kalender, poster/foto, rak buku, lampu gantung, jemuran/tirai, karpet, galon, dsb. Rumah sakit: tirai, monitor, meja kecil, lantai keramik. Contoh: `kamar()`/`hospital()`/`corridor()` di `animasi/transfer/transfer-1.html`.
- **Sebelum membuat cerita baru, riset dulu** apakah cerita serupa sudah ada (berita, YouTube, TikTok, fiksi online), lalu buat premis yang berbeda.

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
- **Biaya**: ± 2.400 kredit per versi untuk naskah ± 1.700 karakter. **Selalu buat 1 versi saja (`generations_count: 1`)** — keputusan pengguna untuk menghemat kredit. Kalau ada kalimat yang kurang pas, buat ulang kalimat itu saja, bukan seluruh naskah. Kuota paket Creator 131.000 kredit/bulan, reset otomatis tiap bulan (sekitar tanggal 14).
- Hasil: ± 15–18 huruf per detik; jeda `[pause]` ± 0,3–0,7 detik.

## 5. Alur kerja cerita baru

1. Tulis naskah (`naskah-<judul>.md`): tabel nomor, narasi, adegan. Minta persetujuan pengguna.
2. Salin `sumur-mbah-darmi.html` → `<judul>.html`; ganti `SCRIPT` (teks + kunci adegan + kamera) dan tambah adegan/properti baru di `paintScene()`. Set `const TIMES=null;`.
3. Render preview tanpa suara: `node animasi/render.js animasi/output/<judul>-preview.mp4 "" 540 30`; cek satu bingkai per adegan.
4. Buat suara di ElevenLabs (pengaturan di bagian 4). Unduh hasilnya (host `elevenlabsusercontent.com` harus diizinkan — environment **sakawitara-platform** sudah mengizinkannya).
5. Cocokkan waktu: `silencedetect` (`noise=-38dB`, `d=0.12`), pilih jeda yang paling sesuai dengan panjang tiap baris, lalu periksa baris dengan kecepatan janggal (< 10 atau > 22 huruf/detik) dan perbaiki manual. Isi `TIMES`.
6. Render final: `node animasi/render.js animasi/output/<judul>.mp4 animasi/<narasi>.mp3 1080 30`; cek beberapa bingkai bahwa caption sesuai kata.
7. Musik latar & efek suara ditambahkan pengguna sendiri (CapCut).
