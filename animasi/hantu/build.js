// Membangun episode "Hantu Kena Sensor": campur audio sesuai linimasa, lalu render MP4 1080×1920.
// Pemakaian (dari root repo): python3 animasi/hantu/sfx.py && node animasi/hantu/build.js [file.html] [nama-keluaran]
// Bawaan: hantu-kena-sensor.html. Versi gaya Mbah Darmi: hantu-gaya-darmi.html hantu-gaya-darmi
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const [html = 'hantu-kena-sensor.html', name = 'hantu-kena-sensor'] = process.argv.slice(2);
  const out = path.join(dir, 'output');
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, html));
  const { duration, audio } = await page.evaluate(() => ({ duration: window.SAKA.duration, audio: window.SAKA.audio }));
  await browser.close();

  // Setiap klip ditunda ke waktunya (adelay), diatur volumenya, lalu dijumlahkan tanpa normalisasi.
  const args = ['-y', '-loglevel', 'error'];
  audio.forEach(([file]) => args.push('-i', path.join(dir, file)));
  const parts = audio.map(([, t, vol], i) => {
    const ms = Math.round(t * 1000);
    return `[${i}:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=${vol},adelay=${ms}|${ms}[a${i}]`;
  });
  const inputs = audio.map((_, i) => `[a${i}]`).join('');
  const filter = `${parts.join(';')};${inputs}amix=inputs=${audio.length}:normalize=0,volume=2.2,alimiter=limit=0.93,atrim=0:${duration}[out]`;
  const wav = path.join(out, name + '-audio.wav');
  execFileSync('ffmpeg', [...args, '-filter_complex', filter, '-map', '[out]', wav], { stdio: 'inherit' });
  console.log('Audio:', wav);

  execFileSync('node', [path.join(dir, '..', 'render.js'), path.join(out, name + '.mp4'), wav, '1080', '30', 'hantu/' + html], { stdio: 'inherit' });
})();
