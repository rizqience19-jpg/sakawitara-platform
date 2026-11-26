// Membuat thumbnail dari satu bingkai animasi + teks hook besar.
// Pemakaian (dari root repo):
//   node animasi/thumb.js <html relatif ke animasi/> <detik> "<HOOK BARIS 1|BARIS 2|...>" <keluaran tanpa ekstensi> [kata-sorot]
// Hasil: <keluaran>-vertikal.png (1080×1920, cover Shorts/Reels/TikTok) dan <keluaran>-yt.png (1280×720, thumbnail YouTube).
// Kata-sorot (opsional) diwarnai kuning; baris lain putih bergaris hitam tebal.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [html, tStr, hook, out, highlight = ''] = process.argv.slice(2);
  if (!html || !tStr || !hook || !out) {
    console.error('Pemakaian: node animasi/thumb.js <html> <detik> "<HOOK|BARIS>" <keluaran> [kata-sorot]');
    process.exit(1);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(__dirname, html));
  const lines = hook.split('|').map(s => s.trim()).filter(Boolean);
  const res = await page.evaluate(([t, lines, hl]) => {
    // Bingkai tanpa caption & judul: pakai paintScene langsung lewat SAKA.frame lalu tutup caption dengan gambar ulang.
    window.caption = function () {};  // tanpa caption kata
    window.THUMB = true;  // adegan boleh menyembunyikan label (GAGAL/KUNCINYA)
    const src = window.SAKA.frame(t, 1080);
    const img = new Image();
    return new Promise(done => {
      img.onload = () => {
        const make = (W, H, mode) => {
          const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
          if (mode === 'v') {
            g.drawImage(img, 0, 0, W, H);
          } else {
            // Latar: bingkai diperbesar & diburamkan; kanan: bingkai utuh.
            g.filter = 'blur(18px) brightness(.55)'; g.drawImage(img, 0, -H * .6, W, W * 1920 / 1080); g.filter = 'none';
            // Potong bagian tengah bingkai (tokoh) supaya wajah lebih besar.
            const sy = 1920 * .28, sh = 1920 * .5, dw = H * 1080 / sh; g.drawImage(img, 0, sy, 1080, sh, W - dw + 40, 0, dw, H);
          }
          // Gelapkan area teks supaya terbaca.
          const grad = mode === 'v' ? g.createLinearGradient(0, 300, 0, H * .55) : g.createLinearGradient(0, 0, W * .7, 0);
          grad.addColorStop(0, 'rgba(0,0,0,.75)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = grad; g.fillRect(0, 0, W, mode === 'v' ? H * .5 : H);
          const maxW = mode === 'v' ? W * .9 : W * .58;
          let size = mode === 'v' ? 84 : 78;
          g.font = '900 ' + size + 'px system-ui, sans-serif';
          const widest = Math.max(...lines.map(l => g.measureText(l).width));
          if (widest > maxW) size = Math.floor(size * maxW / widest);
          g.font = '900 ' + size + 'px system-ui, sans-serif'; g.textBaseline = 'middle'; g.lineJoin = 'round';
          const lh = size * 1.12, x0 = mode === 'v' ? W / 2 : 50, y0 = mode === 'v' ? 560 : H / 2 - (lines.length - 1) * lh / 2;
          g.textAlign = mode === 'v' ? 'center' : 'left';
          lines.forEach((l, i) => {
            const y = y0 + i * lh;
            g.lineWidth = size * .2; g.strokeStyle = '#000'; g.strokeText(l, x0, y);
            g.fillStyle = hl && l.toUpperCase().includes(hl.toUpperCase()) ? '#ffd93a' : '#ffffff'; g.fillText(l, x0, y);
          });
          // Label kanal kecil.
          const tag = 'Kisah Nyempil'; const ts = mode === 'v' ? 40 : 30; g.font = '800 ' + ts + 'px system-ui, sans-serif';
          const tw = g.measureText(tag).width + 36, tx = mode === 'v' ? W / 2 - tw / 2 : 50, ty = mode === 'v' ? 440 : 40;
          g.fillStyle = '#e8402a'; g.beginPath(); g.roundRect(tx, ty - ts * .8, tw, ts * 1.6, 12); g.fill();
          g.fillStyle = '#fff'; g.textAlign = 'left'; g.fillText(tag, tx + 18, ty);
          return c.toDataURL('image/png');
        };
        done({ v: make(1080, 1920, 'v'), h: make(1280, 720, 'h') });
      };
      img.src = src;
    });
  }, [Number(tStr), lines, highlight]);
  for (const [k, suf] of [['v', '-vertikal.png'], ['h', '-yt.png']]) {
    fs.writeFileSync(out + suf, Buffer.from(res[k].split(',')[1], 'base64'));
    console.log('Thumbnail:', out + suf);
  }
  await browser.close();
})();
