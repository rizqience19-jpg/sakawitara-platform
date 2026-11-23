// Merender animasi menjadi MP4 9:16 bingkai demi bingkai.
// Pemakaian: node animasi/render.js <keluaran.mp4> [rekaman-suara] [lebar=1080] [fps=30] [html relatif ke animasi/]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const [out = 'animasi/output/sumur-mbah-darmi.mp4', audio, width = '1080', fps = '30', html = 'sumur-mbah-darmi.html'] = process.argv.slice(2);
  const w = Number(width), f = Number(fps);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(__dirname, html));
  if (errors.length) throw new Error(errors.join('\n'));
  const duration = await page.evaluate(() => window.SAKA.duration);
  const total = Math.ceil(duration * f);

  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(f), '-i', '-'];
  if (audio) args.push('-i', audio, '-c:a', 'aac', '-b:a', '160k');
  args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '16', '-movflags', '+faststart', '-t', String(duration), out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });

  for (let i = 0; i < total; i++) {
    const url = await page.evaluate(([t, w]) => window.SAKA.frame(t, w), [i / f, w]);
    const ok = ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'));
    if (!ok) await new Promise(r => ff.stdin.once('drain', r));
    if (i % (f * 10) === 0) process.stdout.write(`\r${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c ? rej(new Error('ffmpeg ' + c)) : res())));
  await browser.close();
  if (errors.length) console.error('\nGalat halaman:\n' + errors.join('\n'));
  console.log(`\nSelesai: ${out} (${duration.toFixed(1)} detik, ${total} bingkai)`);
})();
