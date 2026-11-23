/* Ilustrasi SVG orisinal untuk scene "3D Motion".
   Setiap komponen bisa diganti <img src="layer.png"> tanpa mengubah engine animasinya. */

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.round((x - Math.floor(x)) * 1000) / 1000;
};
/** dibulatkan agar SSR & browser menghasilkan atribut SVG yang identik */
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ───────── Semak / pohon bulat (kumpulan lingkaran berbentuk kubah) ───────── */
export function Foliage({ colors, count = 34, seed = 1, className = "", trunk }: { colors: string[]; count?: number; seed?: number; className?: string; trunk?: string }) {
  const blobs = Array.from({ length: count }, (_, i) => {
    const t = rnd(seed + i * 1.37);
    const h = 125 * Math.sqrt(Math.max(0, 1 - ((t - 0.5) * 2) ** 2));
    return {
      cx: r2(12 + t * 176),
      cy: r2(150 - rnd(seed + i * 7.31) * h),
      r: r2(13 + rnd(seed + i * 3.17) * 20),
      c: colors[i % colors.length],
    };
  }).sort((a, b) => a.cy - b.cy);
  return (
    <svg viewBox="0 0 200 160" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      {trunk && <path d="M96 160 C 98 120, 92 100, 100 70 M100 110 C 110 95, 120 90, 130 80 M98 120 C 85 105, 75 100, 66 92" stroke={trunk} strokeWidth="5" fill="none" strokeLinecap="round" />}
      {blobs.map((b, i) => (
        <g key={i}>
          <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.c} />
          <circle cx={r2(b.cx - b.r * 0.3)} cy={r2(b.cy - b.r * 0.35)} r={r2(b.r * 0.35)} fill="#fff" opacity=".12" />
        </g>
      ))}
      <rect x="0" y="148" width="200" height="12" fill={colors[0]} />
    </svg>
  );
}

/* ───────── Mawar ───────── */
function Rose({ x, y, r, c, c2, rot = 0 }: { x: number; y: number; r: number; c: string; c2: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <circle r={r} fill={c} />
      <path d={`M${r2(-r * 0.7)} ${r2(r * 0.1)} A ${r2(r * 0.7)} ${r2(r * 0.7)} 0 1 1 ${r2(r * 0.15)} ${r2(r * 0.68)}`} fill="none" stroke={c2} strokeWidth={r2(r * 0.12)} strokeLinecap="round" />
      <path d={`M${r2(-r * 0.35)} 0 A ${r2(r * 0.38)} ${r2(r * 0.38)} 0 1 1 ${r2(r * 0.1)} ${r2(r * 0.36)}`} fill="none" stroke={c2} strokeWidth={r2(r * 0.12)} strokeLinecap="round" />
      <circle r={r2(r * 0.14)} fill={c2} />
    </g>
  );
}

function Leaf({ x, y, s, rot, c }: { x: number; y: number; s: number; rot: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C 10 -10, 30 -10, 42 0 C 30 10, 10 10, 0 0 Z" fill={c} />
      <path d="M2 0 H38" stroke="#000" strokeOpacity=".15" strokeWidth="1" />
    </g>
  );
}

/* Rangkaian bunga — dipakai untuk foreground & sudut cover */
export function FlowerBed({ seed = 3, roses, leaves, className = "", count = 9 }: { seed?: number; roses: [string, string][]; leaves: string[]; className?: string; count?: number }) {
  const items = Array.from({ length: count }, (_, i) => ({
    x: r2(18 + rnd(seed + i * 2.1) * 164),
    y: r2(40 + rnd(seed + i * 5.7) * 50),
    r: r2(11 + rnd(seed + i * 4.3) * 12),
    p: roses[i % roses.length],
    rot: r2(rnd(seed + i) * 360),
  }));
  const lv = Array.from({ length: count * 2 }, (_, i) => ({
    x: r2(5 + rnd(seed + i * 3.9) * 190),
    y: r2(40 + rnd(seed + i * 6.1) * 55),
    s: r2(0.6 + rnd(seed + i * 8.3) * 0.7),
    rot: r2(-170 + rnd(seed + i * 2.9) * 160),
    c: leaves[i % leaves.length],
  }));
  return (
    <svg viewBox="0 0 200 100" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      {lv.map((l, i) => (
        <Leaf key={`l${i}`} {...l} />
      ))}
      {items.map((it, i) => (
        <Rose key={i} x={it.x} y={it.y} r={it.r} c={it.p[0]} c2={it.p[1]} rot={it.rot} />
      ))}
    </svg>
  );
}

/* ───────── Lili merah (tema Jawa) ───────── */
export function Lily({ className = "", color = "#d4473b", inner = "#f2a08f" }: { className?: string; color?: string; inner?: string }) {
  return (
    <svg viewBox="-60 -60 120 120" className={className} aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`rotate(${i * 60 + 10})`}>
          <path d="M0 0 C 12 -14, 10 -38, 0 -55 C -10 -38, -12 -14, 0 0 Z" fill={color} />
          <path d="M0 -6 C 3 -18, 2 -34, 0 -44" stroke={inner} strokeWidth="2" fill="none" />
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={`s${i}`} transform={`rotate(${i * 60 + 40})`}>
          <path d="M0 0 L0 -30" stroke="#7a3b16" strokeWidth="1.2" />
          <ellipse cx="0" cy="-31" rx="2" ry="4" fill="#5b2a0c" />
        </g>
      ))}
      <circle r="6" fill="#f6d27a" />
    </svg>
  );
}

/* ───────── Gedung klasik ───────── */
export function Mansion({ className = "" }: { className?: string }) {
  const wall = "#efe4cf";
  const wall2 = "#e2d3b6";
  const trim = "#fbf6ec";
  const roof = "#8794a0";
  const roof2 = "#6f7c88";
  const glass = "#5f7180";
  const winX = [36, 60, 84, 222, 246, 270];
  const floors = [104, 148, 192];
  return (
    <svg viewBox="0 0 320 250" className={className} aria-hidden>
      <polygon points="10,94 40,58 280,58 310,94" fill={roof} />
      {[70, 110, 210, 250].map((x) => (
        <g key={x}>
          <rect x={x} y="66" width="16" height="20" rx="8" fill={trim} />
          <rect x={x + 3} y="70" width="10" height="14" rx="5" fill={glass} />
        </g>
      ))}
      <rect x="20" y="92" width="280" height="150" fill={wall} />
      <rect x="20" y="92" width="280" height="6" fill={trim} />
      <rect x="20" y="136" width="280" height="4" fill={wall2} />
      <rect x="20" y="180" width="280" height="4" fill={wall2} />
      {floors.map((y) =>
        winX.map((x) => (
          <g key={`${x}-${y}`}>
            <rect x={x - 2} y={y - 2} width="18" height="30" rx="9" fill={trim} />
            <rect x={x} y={y} width="14" height="26" rx="7" fill={glass} />
            <rect x={x - 4} y={y + 26} width="22" height="4" fill={trim} />
          </g>
        ))
      )}
      {/* paviliun tengah */}
      <polygon points="104,64 122,18 198,18 216,64" fill={roof2} />
      <rect x="150" y="6" width="20" height="16" rx="3" fill={roof2} />
      <circle cx="160" cy="40" r="10" fill={trim} />
      <circle cx="160" cy="40" r="6" fill={glass} />
      <rect x="112" y="62" width="96" height="180" fill={trim} />
      <polygon points="112,62 160,40 208,62" fill={wall2} opacity=".6" />
      {[124, 150, 176].map((x) =>
        [76, 118, 160].map((y) => (
          <g key={`c${x}-${y}`}>
            <rect x={x} y={y} width="20" height="32" rx="10" fill={glass} />
            <rect x={x - 3} y={y + 32} width="26" height="4" fill={wall2} />
          </g>
        ))
      )}
      {[116, 140, 180, 204].map((x) => (
        <rect key={x} x={x - 2} y="196" width="5" height="46" fill={wall2} />
      ))}
      <rect x="146" y="200" width="28" height="42" rx="14" fill={glass} />
      <rect x="108" y="240" width="104" height="5" fill={wall2} />
      <rect x="100" y="245" width="120" height="5" fill={trim} />
    </svg>
  );
}

/* ───────── Air mancur (air beranimasi) ───────── */
export function Fountain({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <g className="jet">
        <path d="M60 18 C 50 10, 38 14, 30 40" stroke="#cfe6ee" strokeWidth="2" fill="none" />
        <path d="M60 18 C 70 10, 82 14, 90 40" stroke="#cfe6ee" strokeWidth="2" fill="none" />
        <path d="M60 30 C 52 26, 44 30, 40 48" stroke="#e6f3f7" strokeWidth="1.5" fill="none" />
        <path d="M60 30 C 68 26, 76 30, 80 48" stroke="#e6f3f7" strokeWidth="1.5" fill="none" />
      </g>
      <ellipse cx="60" cy="22" rx="14" ry="4" fill="#d9ccb2" />
      <rect x="56" y="22" width="8" height="40" fill="#cdbf9f" />
      <ellipse cx="60" cy="70" rx="56" ry="14" fill="#cdbf9f" />
      <ellipse cx="60" cy="66" rx="50" ry="10" fill="#9fc3cf" />
      <ellipse cx="60" cy="66" rx="50" ry="10" fill="none" stroke="#e8dcc4" strokeWidth="3" />
    </svg>
  );
}

/* ───────── Burung angsa / merak bergaya ───────── */
export function Swan({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 90" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M30 80 C 10 78, 8 55, 28 50 C 45 46, 55 60, 70 52 C 62 40, 60 22, 72 12 C 80 6, 90 10, 88 18 C 80 16, 74 20, 76 34 C 78 50, 92 64, 80 76 C 70 86, 45 84, 30 80 Z" fill="#a8977c" />
      <path d="M28 60 C 40 58, 55 66, 70 62" stroke="#ece2cf" strokeWidth="2" fill="none" />
      <path d="M30 68 C 42 66, 56 72, 72 70" stroke="#ece2cf" strokeWidth="2" fill="none" />
      <path d="M88 18 L96 20 L88 22 Z" fill="#c98a3c" />
      <circle cx="82" cy="15" r="1.4" fill="#2b2b2b" />
    </svg>
  );
}

/* ───────── Kupu-kupu (sayap mengepak) ───────── */
export function Butterfly({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 40 30" aria-hidden>
      <g className="bf-wing bf-l">
        <path d="M20 15 C 12 0, 1 2, 4 11 C 0 19, 9 26, 20 16 Z" fill={c1} />
        <circle cx="9" cy="10" r="2" fill={c2} />
      </g>
      <g className="bf-wing bf-r">
        <path d="M20 15 C 28 0, 39 2, 36 11 C 40 19, 31 26, 20 16 Z" fill={c1} />
        <circle cx="31" cy="10" r="2" fill={c2} />
      </g>
      <path d="M20 8 V22" stroke="#2a2018" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Kawanan burung ───────── */
export function Birds({ color = "#3a332b" }: { color?: string }) {
  const pos = [
    [0, 10],
    [18, 0],
    [34, 14],
    [52, 4],
    [66, 18],
    [84, 8],
  ];
  return (
    <svg viewBox="-5 -10 110 40" aria-hidden>
      {pos.map(([x, y], i) => (
        <path key={i} className="bird" style={{ animationDelay: `${i * 0.11}s` }} d={`M${x} ${y} q 5 -6 10 0 q 5 -6 10 0`} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}

/* ───────── Pegunungan & air terjun ───────── */
export function Waterfall({ className = "" }: { className?: string }) {
  const stripes = Array.from({ length: 22 });
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id="wf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf4e8" />
          <stop offset="1" stopColor="#f0dcc2" />
        </linearGradient>
        <linearGradient id="wf-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8826a" />
          <stop offset="1" stopColor="#6a4936" />
        </linearGradient>
        <linearGradient id="wf-mtn2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcc4ad" />
          <stop offset="1" stopColor="#bf9f86" />
        </linearGradient>
        <linearGradient id="wf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fe0ea" />
          <stop offset="1" stopColor="#48b3c7" />
        </linearGradient>
        <clipPath id="wf-fall">
          <path d="M184 250 L216 250 L232 540 L168 540 Z" />
        </clipPath>
        <clipPath id="wf-river">
          <path d="M162 535 C 130 600, 270 615, 228 670 C 190 720, 70 720, 0 780 L0 800 L400 800 L400 730 C 330 725, 280 690, 298 640 C 314 595, 252 575, 238 535 Z" />
        </clipPath>
      </defs>
      <rect width="400" height="800" fill="url(#wf-sky)" />
      <circle cx="300" cy="120" r="46" fill="#fff5e2" opacity=".8" />
      <polygon points="0,330 70,240 130,300 200,205 268,285 336,225 400,275 400,800 0,800" fill="url(#wf-mtn2)" />
      <g clipPath="url(#wf-fall)">
        <rect x="160" y="240" width="80" height="310" fill="url(#wf-water)" />
        <g>
          <animateTransform attributeName="transform" type="translate" from="0 -28" to="0 0" dur="0.6s" repeatCount="indefinite" />
          {stripes.map((_, i) => (
            <rect key={i} x={170 + (i % 3) * 18} y={222 + i * 14} width="14" height="9" rx="4" fill="#f2feff" opacity=".7" />
          ))}
        </g>
      </g>
      <g clipPath="url(#wf-river)">
        <rect x="0" y="520" width="400" height="280" fill="url(#wf-water)" />
        <g>
          <animateTransform attributeName="transform" type="translate" from="-30 -10" to="0 0" dur="1.4s" repeatCount="indefinite" />
          {Array.from({ length: 20 }).map((_, i) => (
            <path key={i} d={`M-40 ${520 + i * 15} q 30 -5 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`} stroke="#f2feff" strokeWidth="2.5" fill="none" opacity=".55" />
          ))}
        </g>
      </g>
      <ellipse cx="200" cy="540" rx="80" ry="20" fill="#fff" opacity=".6" className="mist" />
      <polygon points="0,300 64,250 128,335 184,250 168,560 118,800 0,800" fill="url(#wf-mtn)" />
      <polygon points="400,290 334,240 272,325 216,250 232,560 290,800 400,800" fill="url(#wf-mtn)" />
      <polygon points="0,470 80,430 140,560 112,800 0,800" fill="#5a3c2b" opacity=".55" />
      <polygon points="400,460 322,425 262,560 292,800 400,800" fill="#5a3c2b" opacity=".55" />
      <path d="M40 330 L70 380 M100 350 L130 420 M300 330 L330 390 M350 360 L372 410 M150 380 L160 450 M250 380 L240 450" stroke="#4d3324" strokeWidth="2" opacity=".35" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Rumah joglo ───────── */
export function Joglo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden>
      <defs>
        <pattern id="sirap" width="8" height="6" patternUnits="userSpaceOnUse">
          <rect width="8" height="6" fill="#9a6a3c" />
          <path d="M0 5.5 H8 M4 0 V5.5" stroke="#74491f" strokeWidth=".8" />
        </pattern>
      </defs>
      <polygon points="122,22 198,22 232,84 88,84" fill="url(#sirap)" />
      <polygon points="88,84 232,84 296,134 24,134" fill="url(#sirap)" />
      <polygon points="24,134 296,134 316,150 4,150" fill="#7a4e25" />
      <rect x="114" y="14" width="92" height="9" rx="2" fill="#5e3b1a" />
      <path d="M114 14 c -10 -2, -14 -12, -6 -14 M206 14 c 10 -2, 14 -12, 6 -14" stroke="#5e3b1a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M88 84 H232 M24 134 H296" stroke="#5e3b1a" strokeWidth="3" />
      {[48, 104, 216, 272].map((x) => (
        <rect key={x} x={x - 4} y="150" width="8" height="40" fill="#6b4220" />
      ))}
      <rect x="140" y="152" width="40" height="38" fill="#4d2e14" />
      <rect x="14" y="188" width="292" height="12" rx="2" fill="#a98a66" />
    </svg>
  );
}

/* ───────── Bingkai ukir (jatuh dari atas) ───────── */
export function CarvedBand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 70" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="carve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c69b62" />
          <stop offset="1" stopColor="#8d6436" />
        </linearGradient>
      </defs>
      <rect width="400" height="46" fill="url(#carve)" />
      {Array.from({ length: 10 }).map((_, i) => {
        const x = i * 40;
        return (
          <g key={i} stroke="#f3dcb1" strokeWidth="2.2" fill="none" strokeLinecap="round">
            <path d={`M${x + 4} 40 C ${x + 4} 14, ${x + 30} 8, ${x + 30} 26 C ${x + 30} 36, ${x + 18} 36, ${x + 18} 28`} />
            <path d={`M${x + 36} 8 C ${x + 40} 20, ${x + 44} 22, ${x + 48} 14`} opacity=".7" />
          </g>
        );
      })}
      <path d="M0 46 Q 10 66 20 46 T 40 46 T 60 46 T 80 46 T 100 46 T 120 46 T 140 46 T 160 46 T 180 46 T 200 46 T 220 46 T 240 46 T 260 46 T 280 46 T 300 46 T 320 46 T 340 46 T 360 46 T 380 46 T 400 46 Z" fill="url(#carve)" />
    </svg>
  );
}

/* ───────── Pola batik untuk pintu ───────── */
export function BatikPanel({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden>
      <defs>
        <pattern id="batik" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect width="72" height="72" fill="#24160d" />
          <path d="M36 36 m-16 0 a16 16 0 1 1 16 16 a10 10 0 1 1 -10 -10 a5 5 0 1 1 5 5" stroke="#9c6b34" strokeWidth="2" fill="none" />
          <path d="M0 0 c 8 6, 8 14, 0 20 M72 52 c -8 6, -8 14, 0 20" stroke="#9c6b34" strokeWidth="2" fill="none" />
          {[
            [6, 36],
            [66, 36],
            [36, 6],
            [36, 66],
            [14, 14],
            [58, 58],
            [58, 14],
            [14, 58],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" fill="#e4c27e" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#batik)" />
    </svg>
  );
}

/* Tirai daun penuh layar untuk transisi */
export function FoliageCurtain({ color = "#a8936f", color2 = "#bda986" }: { color?: string; color2?: string }) {
  const blobs = Array.from({ length: 70 }, (_, i) => ({
    cx: r2(rnd(i * 1.9 + 4) * 400),
    cy: r2(rnd(i * 4.7 + 2) * 760),
    r: r2(40 + rnd(i * 2.3 + 9) * 70),
    c: i % 3 ? color : color2,
  }));
  return (
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="400" height="700" fill={color} />
      {blobs.map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.c} />
      ))}
      {blobs.slice(0, 40).map((b, i) => (
        <circle key={`h${i}`} cx={r2(b.cx + 12)} cy={r2(b.cy - 10)} r={r2(b.r * 0.18)} fill="#efe6d6" opacity=".55" />
      ))}
      <path d="M60 700 C 80 560, 40 460, 120 360 C 170 300, 230 320, 260 240 M300 700 C 290 600, 330 520, 300 420" stroke="#efe6d6" strokeWidth="6" fill="none" opacity=".5" />
    </svg>
  );
}
