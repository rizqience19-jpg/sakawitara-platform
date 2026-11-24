"use client";

import { useEffect, useRef, useState } from "react";

/** Persegi panjang dengan sudut cekung (melengkung ke dalam), digambar sesuai ukuran asli
 *  supaya lengkung sudut tidak gepeng di layar sempit/lebar. */
function notchPath(w: number, h: number, i: number, r: number) {
  const a = (x: number, y: number) => `A ${r} ${r} 0 0 0 ${x} ${y}`;
  return [
    `M ${i + r} ${i}`,
    `H ${w - i - r}`,
    a(w - i, i + r),
    `V ${h - i - r}`,
    a(w - i - r, h - i),
    `H ${i + r}`,
    a(i, h - i - r),
    `V ${i + r}`,
    a(i + r, i),
    "Z",
  ].join(" ");
}

/** Bingkai krem bergaris emas ganda dengan sudut cekung. Taruh di dalam elemen ber-`position: relative`. */
export function NotchFrame({ r = 30 }: { r?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => setSize([el.clientWidth, el.clientHeight]);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <svg ref={ref} className="nf" aria-hidden>
      {size && (
        <>
          <path className="nf-fill" d={notchPath(size[0], size[1], 0, r)} />
          <path className="nf-l1" d={notchPath(size[0], size[1], 7, r)} />
          <path className="nf-l2" d={notchPath(size[0], size[1], 12, r - 3)} />
        </>
      )}
    </svg>
  );
}

/** Gunungan (kayon) gaya garis emas: siluet + pohon hayat berulir + gapura berkisi. */
const KAYON =
  "M160 4 C 200 70, 282 168, 306 268 C 316 312, 300 342, 272 362 C 261 371, 261 384, 270 396 L 270 420 Q 232 424 204 432 L 172 452 L 160 458 L 148 452 L 116 432 Q 88 424 50 420 L 50 396 C 59 384, 59 371, 48 362 C 20 342, 4 312, 14 268 C 38 168, 120 70, 160 4 Z";

export function Kayon({ className = "", filled = false }: { className?: string; filled?: boolean }) {
  const swirl = (x: number, y: number, s: number, flip: boolean) => {
    const d = flip ? -1 : 1;
    return `M${x} ${y} c ${d * 14 * s} ${-4 * s}, ${d * 26 * s} ${-16 * s}, ${d * 22 * s} ${-28 * s} c ${-d * 3 * s} ${-9 * s}, ${-d * 14 * s} ${-8 * s}, ${-d * 13 * s} ${0} c ${d * 1 * s} ${6 * s}, ${d * 8 * s} ${6 * s}, ${d * 8 * s} ${1 * s}`;
  };
  return (
    <svg className={`kayon ${filled ? "kayon-filled" : ""} ${className}`} viewBox="-6 -6 332 496" aria-hidden>
      <defs>
        <linearGradient id="ky-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9c77c" />
          <stop offset="0.5" stopColor="#a9792f" />
          <stop offset="1" stopColor="#d8b062" />
        </linearGradient>
      </defs>
      <path className="ky-o" pathLength={1} d={KAYON} />
      <path className="ky-i" pathLength={1} d={KAYON} transform="translate(160 250) scale(.9) translate(-160 -250)" />
      {/* batang pohon hayat */}
      <path className="ky-l" pathLength={1} d="M160 300 V 46 M160 458 V 488" />
      {/* ulir daun bertingkat kiri-kanan */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 286 - i * 46;
        const s = 1.25 - i * 0.17;
        return (
          <g key={i}>
            <path className="ky-l" pathLength={1} d={swirl(160, y, s * 1.6, true)} />
            <path className="ky-l" pathLength={1} d={swirl(160, y, s * 1.6, false)} />
            <path className="ky-l" pathLength={1} d={swirl(160, y - 22, s, true)} />
            <path className="ky-l" pathLength={1} d={swirl(160, y - 22, s, false)} />
          </g>
        );
      })}
      {/* gapura berkisi di kaki */}
      <path className="ky-l" pathLength={1} d="M96 330 H 224 L 236 352 H 84 Z M100 352 V 410 H 220 V 352 M118 352 V 410 M140 352 V 410 M160 352 V 410 M180 352 V 410 M202 352 V 410" />
      <path className="ky-l" pathLength={1} d="M100 372 L 220 392 M100 392 L 220 372" />
      <path className="ky-l" pathLength={1} d="M86 416 H 234 M74 430 H 246" />
    </svg>
  );
}
