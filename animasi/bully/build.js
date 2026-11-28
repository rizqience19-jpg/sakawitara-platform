// Membangun "3 Aturan Aneh di Laci Agen BRILink": narasi utuh tanpa dipotong,
// campur efek suara, lalu render MP4 1080×1920.
// Pemakaian (dari root repo): python3 animasi/bully/sfx.py && node animasi/bully/build.js
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname, name = 'wati';
  const out = path.join(dir, 'output');
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, name + '.html'));
  const { duration, audio } = await page.evaluate(() => ({ duration: window.SAKA.duration, audio: window.SAKA.audio }));
  await browser.close();

  // Event: [berkas, waktu, volume, potong_mulai?, potong_selesai?]
  const args = ['-y', '-loglevel', 'error'];
  audio.forEach(([file]) => args.push('-i', path.join(dir, file)));
  const parts = audio.map(([, t, vol, a, b, tempo], i) => {
    const ms = Math.round(t * 1000);
    const trim = a != null ? `atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, b - a - 0.04)}:d=0.04,${tempo ? `atempo=${tempo},` : ''}` : '';
    return `[${i}:a]${trim}aformat=sample_rates=44100:channel_layouts=stereo,volume=${vol},adelay=${ms}|${ms}[a${i}]`;
  });
  const inputs = audio.map((_, i) => `[a${i}]`).join('');
  const filter = `${parts.join(';')};${inputs}amix=inputs=${audio.length}:normalize=0,volume=2.4,acompressor=threshold=-20dB:ratio=3:attack=5:release=150,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=44100,alimiter=limit=0.9,atrim=0:${duration}[out]`;
  const wav = path.join(out, name + '-audio.wav');
  execFileSync('ffmpeg', [...args, '-filter_complex', filter, '-map', '[out]', wav], { stdio: 'inherit' });
  console.log('Audio:', wav);
  execFileSync('node', [path.join(dir, '..', 'render.js'), path.join(out, name + '.mp4'), wav, '1080', '30', 'bully/' + name + '.html'], { stdio: 'inherit' });

  // Bingkai pembuka = thumbnail vertikal (sampul otomatis).
  const thumb = path.join(dir, 'thumbnail', name + '-vertikal.png');
  if (fs.existsSync(thumb)) execFileSync('node', [path.join(dir, '..', 'sampul.js'), path.join(out, name + '.mp4'), thumb], { stdio: 'inherit' });
})();
