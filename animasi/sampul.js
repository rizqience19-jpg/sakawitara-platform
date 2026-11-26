// Menjadikan thumbnail vertikal sebagai bingkai pembuka video (sampul otomatis TikTok/IG/Shorts).
// Thumbnail tampil penuh di awal, lalu memudar cepat ke adegan yang bergerak (± 1 detik, cukup untuk sampul otomatis). Audio tidak diubah.
// Pemakaian (dari root repo): node animasi/sampul.js <video.mp4> <thumbnail-vertikal.png> [detik=1]
// Video ditimpa di tempat (lewat berkas sementara).
const { execFileSync } = require('child_process');
const fs = require('fs');
const [video, png, secStr = '1'] = process.argv.slice(2);
if (!video || !png) { console.error('Pemakaian: node animasi/sampul.js <video.mp4> <thumbnail-vertikal.png> [detik]'); process.exit(1); }
const sec = Number(secStr), fade = 0.25, tmp = video.replace(/\.mp4$/, '.sampul-tmp.mp4');
const filter = `[1:v]scale=1080:1920,format=rgba,fade=t=out:st=${sec - fade}:d=${fade}:alpha=1[s];[0:v][s]overlay=0:0:enable='lte(t,${sec})',format=yuv420p[v]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, '-loop', '1', '-t', String(sec), '-i', png,
  '-filter_complex', filter, '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'copy', '-movflags', '+faststart', tmp], { stdio: 'inherit' });
fs.renameSync(tmp, video);
console.log('Sampul dipasang:', video);
